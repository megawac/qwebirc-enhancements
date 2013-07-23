module.exports = function(grunt) {
    var concatfiles = ['js/src/qwebirc_start.js', 'js/src/util/*.js', 'js/src/qwebirc.js', 'js/src/irc/*.js', 'js/src/ui/Handlebars/*.js', 'js/src/ui/*.js', 'js/src/ui/window/*.js', //ui +etc
    'js/src/qwebirc_end.js'];

    grunt.initConfig({
        meta: {},

        handlebars: {
            dist: {
                options: {
                    namespace: "Handlebars.templates",
                    knownHelpers: ['if', 'each', 'unless'],
                    wrapped: "true",
                    processContent: function(content) {//remove whitespace
                        content = content.replace(/^[\x20\t]+/mg, '').replace(/[\x20\t]+$/mg, '');
                        content = content.replace(/^[\r\n]+/, '').replace(/[\r\n]*$/, '\n');
                        return content;
                    },

                    processName: function(filename) {
                        return filename.substring(filename.lastIndexOf("/") + 1, filename.length-4);//last dash to the end of string (sub .hbs)
                    }
                },
                files: {
                    "js/templates.js": ['js/src/ui/Handlebars/templates/*.hbs']
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
                dest: 'js/qwebirc.js'
            },

            full: {
                // the files to concatenate
                src: ['js/libs/*.js', 'js/src/prelude.js',
                //'js/functional+.js',
                // //'js/to-function.js',
                // 'js/src/Templates.js',
                'js/qwebirc.js'],
                // the location of the resulting JS file
                dest: 'js/qwebirc-0.93dev.js'
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
                    'js/qwebirc.min.js': ['js/qwebirc.js']
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

    grunt.registerTask('default', [

    'handlebars',

    'concat:qweb', 'concat:full'
    // , 'uglify:strip'
    //, 'uglify:min'
    ]);
};