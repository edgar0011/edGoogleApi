module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    var options = {
        config : {
            src: "grunt/*.js",
            mock:false
        }
    };

    // Load tasks into the Grunt
    var externalConfigs = require('load-grunt-configs')(grunt, options);

    grunt.initConfig(externalConfigs);

    // Build configuration
    var config = {
        app: 'src', //application source code folder
        dist: 'dist', //application distribution folder
        temp: 'temp' //temp dir for concat, uglify
    };

    grunt.extendConfig({
        config:config,
        pkg: grunt.file.readJSON('package.json'),


        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: ['<%= config.dist %>/*']
                    }
                ]
            },
            release: {
                files: [
                    {
                        dot: true,
                        src: [
                            'temp',
                            '<%= config.dist %>/temp',
                            //'<%= config.dist %>/**/*.js',
                            '!<%= config.dist %>/*.js',
                            '!<%= config.dist %>/*.min.js'

                        ]
                    }
                ]
            },
            docs: {
                files: [
                    {src: "docs"}
                ]
            }

        },

        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                src: [

                    '<%= config.dist %>/<%= config.temp %>/ed.ui.js',
                    '<%= config.dist %>/<%= config.temp %>/*/*.js',
                    '<%= config.dist %>/<%= config.temp %>/app.templates.js'
                    //'<%= config.dist %>/<%= config.temp %>/app.templates.js'
                ],
                dest: '<%= config.dist %>/<%= config.temp %>/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                mangle: false,
                flatten: false
            },
            dist: {
                files: {
                    '<%= config.dist %>/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },


        ngtemplates:  {
            "ed.ui": {
                cwd:      '<%= config.app %>',
                src:      ['**/*.html'],
                dest:     '<%= config.dist %>/<%= config.temp %>/app.templates.js'
            }
        },

        wrap: {
            default: {
                src: ['<%= config.dist %>/**/*.js', '<%= config.dist %>/*.js'],
                dest: "",
                options: {
                    wrapper: ['(function () {\n\'use strict\'; \n', '\n})();']
                }
            },

            release: {
                src: ['<%= config.dist %>/<%= config.temp %>/**/*.js', '<%= config.dist %>/<%= config.temp %>/*.js'],
                dest: "",
                options: {
                    wrapper: ['(function () {\n\'use strict\'; \n', '\n})();']
                }
            }
        },

        jshint: {
            files: ['Gruntfile.js', '<%= config.app %>/**/*.js', '<%= config.app %>/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },

        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            default: {
                files: [
                    {
                        expand: true,
                        src: ['<%= config.dist %>/**/*.js'],
                        extDot: 'last'      // Extensions in filenames begin after the last dot
                    }
                ]
            },
            release: {
                files: [
                    {
                        expand: true,
                        src: ['<%= config.dist %>/<%= config.temp %>/**/*.js'],
                        extDot: 'last'      // Extensions in filenames begin after the last dot
                    }
                ]
            }
        },

        less: {
            style: {
                files: [
                    {
                        '<%= config.dist %>/styles/main.css': '<%= config.app %>/main.less'
                    }
                ]
            }
        },

        copy: {
            debug: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.app %>',
                        dest: '<%= config.dist %>',
                        src: [
                            '*.html'
                        ]
                    }
                ]
            },

            bower: {
                files: [

                    {expand:true, cwd: '<%= config.app %>', src:['*.js'], dest:'<%= config.dist %>'},
                    {expand:true, cwd: '<%= config.app %>', src:['**/*.*'], dest:'<%= config.dist %>'}

                ]
            },
            release: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.app %>',
                        dest: '<%= config.dist %>',
                        src: [
                            'index.html'
                        ]
                    },

                    {expand:true, cwd: '<%= config.app %>', src:['*.js'], dest:'<%= config.dist %>/<%= config.temp %>'},
                    {expand:true, cwd: '<%= config.app %>', src:['**/*.js'], dest:'<%= config.dist %>/<%= config.temp %>'}

                ]
            },

            releaseLess: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        cwd: '<%= config.app %>',
                        dest: '<%= config.dist %>/less',
                        src: [
                            '**/*.less',
                            '!main.less'
                        ]
                    }
                ]
            },

            specialRelease: {
                files: {
                    '<%= config.dist %>/<%= pkg.name %>.js': ['<%= concat.dist.dest %>']
                }
            }

        },

        ngdocs: {
            options: {
                doc: 'docs',
                title: 'edGraham Docs',
                html5Mode: false
            },

            app: {
                src: ['app/**/*.js', '!app/bower/**/*.js'],
                title: "edGraham"
            }
        }

    });




    grunt.registerTask('docs', function () {
        grunt.task.run([
            'clean:docs',
            'jshint',
            'ngdocs'
        ]);
    });

    grunt.registerTask('build', function () {
        grunt.task.run([
            'clean:dist',
            'ts:release',
            'less',
            'ngtemplates',
            'jshint',
            'copy:release',
            'copy:releaseLess',
            'wrap:release',
            'ngAnnotate:release',
            'concat',
            'uglify',
            //'copy:specialRelease',
            'clean:release'
        ]);
    });
};
