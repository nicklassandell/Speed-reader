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

        sass: {
            dev: {
                files: [{
                    expand: true,
                    cwd: '../scss',
                    src: '*.scss',
                    dest: '../css/',
                    ext: '.css'
                }]
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
                tasks: ['sass:dev']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-sass');

    grunt.registerTask('default', ['watch:js', 'watch:scss']);
    grunt.registerTask('dist', ['sass:dev', 'uglify:dist']);


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