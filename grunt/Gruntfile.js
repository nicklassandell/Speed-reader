module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            app: {
                options: {
                    mangle: false,
                    preserveComments: true,
                    beautify: true
                },
                files: {
                    '../js/min/app.js' : ['../js/libs/jquery.min.js', '../js/libs/angular.js', '../js/libs/angular.rzslider.js', '../js/mousetrap.js', '../js/app.js']
                }
            },
            popup: {
                options: {
                    mangle: false,
                    preserveComments: true,
                    beautify: true
                },
                files: {
                    '../js/min/popup.js' : ['../js/libs/jquery.min.js', '../js/libs/angular.js', '../js/popup.js']
                }
            }
        },

        compass: {
            dist: {
                options: {
                    sassDir: '../scss/',
                    cssDir: '../css/',
                    environment: 'production'
                }
            },
            dev: {
                options: {
                    sassDir: '../scss/',
                    cssDir: '../css/',
                    outputStyle: 'expanded'
                }
            }
        },

        watch: {
            options: {
                spawn: false
            },
            scss: {
                files: ['../scss/*.scss'],
                tasks: ['compass:dev']
            },

            jsApp: {
                files: ['../js/app.js'],
                tasks: ['uglify:app']
            },
            jsPopup: {
                files: ['../js/popup.js'],
                tasks: ['uglify:popup']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['watch:js']);
}