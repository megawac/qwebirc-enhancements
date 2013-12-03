
/*****************************
Build step. See settings under build in package.json

Flags:
-minify: use uglify to minimize js size
-concat: place css and js all in the same file.
*****************************/

module.exports = function(grunt) {
    var package = grunt.file.readJSON('./package.json');
    var files = {
        qweb: [
            'js/templates/qwebirc.js',
            'js/src/qwebirc_start.js',
            'js/src/util/*.js',
            'templates/Templates.js',
            'js/src/config/**.js',
            'js/src/irc/*.js',
            'js/src/ui/interfaces/*.js',
            'js/src/ui/*.js',//ui +etc
            'js/src/ui/window/*.js',
            'js/src/ui/panes/*.js',
            'js/src/qwebirc_end.js'
        ],
        plugins: [
            'js/libs/*.js',
            'js/libs/Epitome/*.js'
        ],
        full: [
            'js/dist/plugins-<%= pkg.version %>.js',
            'js/dist/qwebirc-<%= pkg.version %>.js'
        ]
    };

    grunt.initConfig({
        pkg: package,
        meta: {},

        handlebars: {
            dist: {
                options: {
                    namespace: 'qwebirc.templates',
                    compilerOptions: {
                        knownHelpers: {
                            'check': true,
                            '$css': true,
                            'enableDisable': true,
                            '$link': true,
                            'format': true,
                            'lang': true
                        },//,
                        knownHelpersOnly: true,
                    },
                    wrapped: true,
                    node: false,
                    // amd: true,
                    processContent: function(content) {//remove whitespace
                        content = content.replace(/^[\x20\t]+/mg, '')
                                        .replace(/[\x20\t]+$/mg, '')
                                        .replace(/\r\n/g, '');//remove line breaks (for min)
                        return content;
                    },

                    processName: function(filename) {
                        return filename.substring(filename.lastIndexOf('/') + 1, filename.length-4);//last dash to the end of string (sub .hbs)
                    }
                },
                files: {
                    'js/templates/qwebirc.js': ['css/modifiablecss.hbs', 'templates/**.hbs'],
                    'js/templates/options.js': ['panes/options.hbs', 'panes/partials/customNotice.hbs'],
                    'js/templates/wizard.js': ['panes/wizard.hbs'],
                    'js/templates/feedback.js': ['panes/feedback.hbs'],
                    'js/templates/about.js': ['panes/about.hbs'],
                    'js/templates/faq.js': ['panes/faq.hbs'],
                    'js/templates/privacypolicy.js': ['panes/privacypolicy.hbs'],
                    'js/templates/popup-alert.js': ['templates/amd/popup-alert.hbs'],
                    'js/templates/popup-dialog.js': ['templates/amd/popup-dialog.hbs'],
                    'js/templates/welcome-pane.js': ['templates/amd/welcome-pane.hbs']
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
                src: files.qweb,
                // the location of the resulting JS file
                dest: 'js/dist/qwebirc-<%= pkg.version %>.js'
            },

            full: {
                src: files.full,
                dest: 'js/dist/qwebirc-full-<%= pkg.version %>.js'
            },

            plugins: {
                src: files.plugins,
                dest: 'js/dist/plugins-<%= pkg.version %>.js'
            }
        },

        uglify: {
            options: {
                mangle: package.build.minify,
                compress: {
                    dead_code: true
                },
                preserveComments: 'none',
                beautify: !package.build.minify,
                ast_lift_variables: true,
                banner: [
                    '/*!',
                    '<%= pkg.name %> ::: Version <%= pkg.version %> :::',
                    'Built on <%= grunt.template.today("yyyy-mm-dd") %>',
                    'Description: <%= pkg.description %>',
                    'Authors: <%= pkg.author.name %> (<%= pkg.author.url %>)',
                    'Repository: <%= pkg.repository %>',
                    '\nThis project is a fork of <%= pkg.fork.name %> (<%= pkg.fork.url %>) by <%= pkg.fork.author %>',
                    '\n\nLicence: <%= pkg.licence.type %> - <%= pkg.licence.url %>',
                    '<%= grunt.file.read(pkg.licence.file) %>',
                    '*/\n'
                ].join("\n")
            },
            plugins: {
                options: {
                    banner: '/*App plugins see: github.com/megawac/qwebirc-enhancements/tree/master/js/libs*/\n'
                },
                files: {
                    'js/dist/plugins-<%= pkg.version %>.js': files.plugins
                }
            },
            qweb: {
                files: {
                    'js/dist/qwebirc-<%= pkg.version %>.js': 'js/dist/qwebirc-<%= pkg.version %>.js'
                }
            },
            full: {
                files: {
                    'js/dist/qwebirc-full-<%= pkg.version %>.js': files.full
                }
            },
            config: {
                options: {banner: ''},
                files: {
                    'js/dist/app-<%= pkg.version %>.js': 'configure/config.js'
                }
            }
        },

        cssmin: {
            combine: {
                files: {
                    'css/qwebirc-<%= pkg.version %>-min.css': ['css/qwebirc.css']
                }
            }
        },

        htmlbuild: {
            qweb: {
                src: 'configure/index.tmpl',
                dest: 'index.html',
                options: {
                    beautify: true,
                    relative: false,
                    data: package,

                    scripts: {
                        bundle: package.build.concat ? ['js/dist/qwebirc-full-<%= pkg.version %>.js'] : files.full,
                        config: ['js/dist/app-<%= pkg.version %>.js']
                    },
                    styles: {
                        bundle: package.build.minify ? ['css/qwebirc-<%= pkg.version %>-min.css'] : ['css/qwebirc.css']
                    }
                }
            }
        }

    });


    // Load the plugin that provides the 'uglify' task.
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    // Default task(s).
    //grunt.registerTask('default', ['uglify']);
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-html-build');

    grunt.registerTask('default', [

        'handlebars',

        'concat:qweb',//has to be concatted first for the iffe
        // 'concat:plugins',

        'uglify:plugins',
        'uglify:qweb',

        'uglify:config',

        'concat:full',

        'cssmin',

        'htmlbuild:qweb'

    ]);

};