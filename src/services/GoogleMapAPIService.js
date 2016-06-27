/**
 * Created by edgar on 12/05/16.
 */

angular.module( "ed.googleApi" )

  .factory( "googleMapAPI", GoogleMapAPI );


function GoogleMapAPI($http, $q, $log, uiGmapGoogleMapApi) {

  function lookUpGeocode(address, zipCode) {
    //GEOCODING
    var deferred = $q.defer();

    var request;

    if (!zipCode) {
      request = {address: address};
    } else {
      request = {
        componentRestrictions: {
          postalCode: address
        }
      };
    }

    uiGmapGoogleMapApi.then(function(){
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode(request, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {

          deferred.resolve(results);

        } else {
          $log.error('Geocode was not successful for the following reason: ' + status);
          deferred.reject('Geocode was not successful for the following reason: ' + status);
        }
      });
    });



    return deferred.promise;

  }

  function getBuildingSiteDistances(buidlingSiteLocation, destinations) {

    var deferred = $q.defer();

    uiGmapGoogleMapApi.then(function() {
      var origin = new google.maps.LatLng(buidlingSiteLocation.lat, buidlingSiteLocation.lng);

      var origins = [];
      for (var i in destinations) {
        origins.push(origin);
      }

      var service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: origins,
          destinations: destinations,
          travelMode: google.maps.TravelMode.DRIVING,
          //transitOptions: TransitOptions,
          //drivingOptions: DrivingOptions,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        }, function (response, status) {

          deferred.resolve(response);
        }, function (error) {
          deferred.reject(response);
        }
      );
    });

    return deferred.promise;

  }

  function googleAddressItemsUnique(address_components){
    var addressItems = address_components.map(function(ac){
      return ac.long_name;
    });

    var usedItems = {};
    var newItems = [];
    addressItems.forEach(function(item, index){
      if (!usedItems[item]){
        usedItems[item] = true;
        newItems.push(item);
      }
    });

    return newItems.join(", ");
  }

  function lookUpMethod(search, resultCallback, faultCallBack, restrictCountries) {


    //zip code formatting

    if (angular.isNumber(Number(search)) && search.toString().length === 5) {

      //search = search.toString().split("").splice(3, 0, " "  ).join("");
      var split = search.toString().split("");
      split.splice(3, 0, " "  );
      search = split.join("");

    }

    if(search.length < 3) {
      return $q.reject();
    }

    //var promise = googleMapAPI.lookUpGeocode(search, true);
    var promises = [];
    if (restrictCountries) {
      restrictCountries.forEach(function(countryCode){
        promises.push($http.get("http://maps.googleapis.com/maps/api/geocode/json?address=" + search + "," + countryCode));
      });
    } else {
      promises = [$http.get("http://maps.googleapis.com/maps/api/geocode/json?address=" + search)];
    }
    var re = $q.all(promises)
      .then(function(response){

        var results = response[0].data.results.concat(response[1].data.results);
        $log.debug("googleapis autocomplete result:");
        $log.debug(results);
        //resultCallback(data.results);

        //todo parse, remap
        var idcs = 0;
        var ar = [];
        results.forEach(function(item) {


          //if (item && item.types && item.types.indexOf("postal_code") === 0) {
          //}

          var czsk = item.address_components.find(function(ac){
            if (ac.short_name === "CZ" || ac.short_name === "SK" &&
              ( ac.short_name !== ac.long_name) &&
              (ac.long_name.toLowerCase().indexOf("republika") > -1 || ac.long_name.toLowerCase().indexOf("slovensko") > -1) ) {
              return ac;
            }
          });

          if (czsk) {
            ar.push({
              id: idcs++,
              name: googleAddressItemsUnique(item),
              location: item.geometry.location,
              data: item
            });
          }


        });

        return ar;

      }.bind(this), function(error){
        //faultCallBack(error);
      }.bind(this));

    return re;

  }

  return {

    lookUpGeocode:lookUpGeocode,
    getBuildingSiteDistances:getBuildingSiteDistances,
    lookUpMethod:lookUpMethod,
    googleAddressItemsUnique:googleAddressItemsUnique

  };


}
