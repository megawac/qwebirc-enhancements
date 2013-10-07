module.exports = function(grunt) {
    var concatfiles = [
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
    'js/src/qwebirc_end.js'];
    var fullconcat = [
    // 'js/module/curl.js'
    'js/libs/*.js',
    'js/libs/Epitome/*.js',
    'js/dist/qwebirc.js'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {},

        handlebars: {
            dist: {
                options: {
                    namespace: "qwebirc.templates",
                    compilerOptions: {
                        knownHelpers: {
                            'check': true,
                            '$css': true,
                            'enableDisable': true,
                            '$link': true,
                            'format': true
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
                        return filename.substring(filename.lastIndexOf("/") + 1, filename.length-4);//last dash to the end of string (sub .hbs)
                    }
                },
                files: {
                    "js/templates/qwebirc.js": ['css/modifiablecss.hbs', 'templates/**.hbs'],
                    "js/templates/options.js": ["panes/options.hbs", "panes/partials/customNotice.hbs"],
                    "js/templates/wizard.js": ["panes/wizard.hbs"],
                    "js/templates/feedback.js": ["panes/feedback.hbs"],
                    "js/templates/about.js": ["panes/about.hbs"],
                    "js/templates/faq.js": ["panes/faq.hbs"],
                    "js/templates/privacypolicy.js": ["panes/privacypolicy.hbs"],
                    "js/templates/popup-alert.js": ["templates/amd/popup-alert.hbs"],
                    "js/templates/popup-dialog.js": ["templates/amd/popup-dialog.hbs"],
                    "js/templates/welcome-pane.js": ["templates/amd/welcome-pane.hbs"]
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
                src: fullconcat,
                // the location of the resulting JS file
                dest: 'js/dist/qwebirc-0.93dev.js'
            }
        },

        copy: {

            demo: {
                files: [{
                    expand: true,
                    src: ['js/dist/qwebirc-0.93dev.js', 'js/modules/**', 'js/panes/**', 'js/templates/**'],
                    dest: 'demo/node/static/'
                },
                {
                    expand: true,
                    src: ['css/*.css'],
                    dest: 'demo/node/static/'
                },
                {
                    expand: true,
                    src: ['js/dist/qwebirc-0.93dev.js', 'js/modules/**', 'js/panes/**', 'js/templates/**'],
                    dest: 'demo/twisted/static/'
                },
                {
                    expand: true,
                    src: ['css/*.css'],
                    dest: 'demo/twisted/static/'
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
            strip: {
                files: {
                    'js/dist/qwebirc-0.93dev.js': fullconcat
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

    'concat:qweb',
    // 'concat:full',
    'uglify:strip',
    'copy:demo',
    //, 'uglify:min'
    ]);
};