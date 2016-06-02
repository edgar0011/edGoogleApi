/**
 * Created by edgar on 09/05/16.
 */
angular.module( "ed.googleApi", ['uiGmapgoogle-maps'] )

.constant("GOOGLE_API_CONFIG", {
    libraries: 'weather,geometry,visualization',
    key: 'AIzaSyD8_Y1ccdeTAVu-MyFgEc2767rm8o1u12Y'
})

.config(function(uiGmapGoogleMapApiProvider, GOOGLE_API_CONFIG){

    uiGmapGoogleMapApiProvider.configure({
        //client : '618505109215-egpm48cfpkqr306367auc1tqvi7fj279.apps.googleusercontent.com',
        libraries: GOOGLE_API_CONFIG.libraries,
        key: GOOGLE_API_CONFIG.key,
        transport: 'http',
        isGoogleMapsForWork: true
    });
    
});