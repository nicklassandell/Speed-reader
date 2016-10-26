module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            dist: {
                options: {
                    mangle: true,
                    preserveComments: false,
                    beautify: false
                },
                files: [{
                    expand: true,
                    cwd: '../js/',
                    src: '*.js',
                    dest: '../js/min',
                    ext: '.js'
                }]
            },
            dev: {
                options: {
                    mangle: false,
                    preserveComments: true,
                    beautify: true
                },

                // This will uglify all files into separate files in min directory
                // It's the default value but it's overwritten by the watch task so that
                // only the changed file is uglified.
                files: [{
                    expand: true,
                    cwd: '../js/',
                    src: '*.js',
                    dest: '../js/min',
                    ext: '.js'
                }]
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
            js: {
                files: ['../js/*.js'],
                tasks: ['uglify:dev']
            },
            scss: {
                files: ['../scss/*.scss'],
                tasks: ['compass:dev']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['watch:js']);


    grunt.event.on('watch', function(action, filepath, target) {

        // Only uglify changed file

        var fileName = filepath.split('\\').pop(),
            dest = '../js/min/' + fileName,
            files = {};

        files[dest] = filepath;

        grunt.log.writeln(dest);
        grunt.config('uglify.dev.files', files);

    });
}