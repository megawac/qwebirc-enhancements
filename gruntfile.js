module.exports = function(grunt) {
    var concatfiles = [
    'js/dist/templates.js',
    'js/src/qwebirc_start.js',
    'js/src/util/*.js',
    'js/src/qwebirc.js',
    'js/src/irc/*.js',
    'js/src/ui/Handlebars/*.js',
    'js/src/ui/*.js',//ui +etc
    'js/src/ui/window/*.js',
    'js/src/qwebirc_end.js'];

    grunt.initConfig({
        meta: {},

        handlebars: {
            dist: {
                options: {
                    namespace: "Handlebars.templates",
                    knownHelpers: ['if', 'each', 'unless', 'check', 'pad'],
                    wrapped: true,
                    node: false,
                    processContent: function(content) {//remove whitespace
                        content = content.replace(/^[\x20\t]+/mg, '').replace(/[\x20\t]+$/mg, '');
                        content = content.replace(/^[\r\n]+/, '').replace(/[\r\n]*$/, '');
                        return content;
                    },

                    processName: function(filename) {
                        return filename.substring(filename.lastIndexOf("/") + 1, filename.length-4);//last dash to the end of string (sub .hbs)
                    }
                },
                files: {
                    "js/dist/templates.js": ['js/src/ui/Handlebars/templates/*.hbs']
                }
            }
        },

        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: '\n'
            },
            qweb: {
                // the files to concatenate
                src: concatfiles,
                // the location of the resulting JS file
                dest: 'js/dist/qwebirc.js'
            },

            full: {
                // the files to concatenate
                src: [
                'js/libs/*.js',
                'js/libs/Epitome/*.js',
                'js/src/prelude.js',
                //'js/functional+.js',
                // //'js/to-function.js',
                // 'js/src/Templates.js',
                'js/dist/qwebirc.js'
                ],
                // the location of the resulting JS file
                dest: 'js/dist/qwebirc-0.93dev.js'
            }
        },

        copy: {

            demo: {
                files: [{
                    expand: true,
                    src: ['js/dist/qwebirc-0.93dev.js'],
                    dest: 'demo/static/'
                },
                {
                    expand: true,
                    src: ['css/*.css', 'css/*.mcss'],
                    dest: 'demo/static/'
                }]
            }
        },

        uglify: {
            options: {
                // the banner is inserted at the top of the output
                //banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
                mangle: false,
                compress: {
                    dead_code: true
                },
                preserveComments: 'some',
                //only comments which start with ! -bang
                beautify: true,
                ast_lift_variables: true

            },
            strip: {
                files: {
                    'js/dist/qwebirc.min.js': ['js/dist/qwebirc.js'],
                    'js/dist/qwebirc-0.93dev-min.js': ['js/dist/qwebirc-0.93dev.js']
                }
            }
        }
    });


    // Load the plugin that provides the "uglify" task.
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    // Default task(s).
    //grunt.registerTask('default', ['uglify']);
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', [

    'handlebars',

    'concat:qweb', 'concat:full',
    'copy:demo'
    // , 'uglify:strip'
    //, 'uglify:min'
    ]);
};