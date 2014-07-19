/*****************************
Build step. See settings under build in build.json

Flags:
-"minify": use uglify to minimize js size
-"concat": place css and js all in the same file.
-"use cdn": load files from a cdn where applicable
*****************************/
/* jshint node:true */
module.exports = function(grunt) {
    var _ = require("lodash");
    var deepTemplate = function(obj, config) { //also cleaning
        return _.chain(obj)
            .omit(function(val) {
                return val == null;
            })
            .mapValues(function(val, key) {
                if (_.isArray(val)) return val;
                if (_.isObject(val)) return deepTemplate(val, config);
                if (_.isString(val)) {
                    if (/(_re|Regex(p)?)$/.test(key)) return new RegExp(val);
                    return _.template(val, config);
                }
                return val;
            })
            .value();
    };
    var package = grunt.file.readJSON("./package.json");
    var build = grunt.file.readYAML("./build.yml");
    var files = grunt.file.readYAML("./build-files.yml");
    var config = grunt.file.readYAML("./app-config.yml");
    config = deepTemplate(config, config);
    var templateContext = {
        package: package,
        pkg: package,
        build: build,
        cfg: config,
        config: config,
        files: files,
        serialize: function(obj, depth) {
            return require("toSrc")(obj, depth || 10);
        },
        getFileURL: function(resource) {//load path to resource
            var resc = files.resources[resource];
            if(build.debug && resc.local) return resc.local;
            if(build["use cdn"] && resc.cdn) {
                return resc.cdn;
            } else {
                return resc.local;
            }
        }
    };

    package.build = build;

    grunt.initConfig({
        pkg: package,
        build: build,
        meta: {},

        suffix: "-<%= pkg.version %>",

        //testing
        express: {
            testing: {
                options: {
                    hostname: "*",
                    port: 9091,
                    server: "./test/server/server",
                    // open: "http://localhost:9091/test/test-runner.html"
                }
            }
        },

        mocha: {
            all: {
                options: {
                    urls: [ "http://localhost:9091/test/test-runner.html" ],
                }
            },
            options: {
                run: true
            }
        },

        jshint: {
            all: {
                files: {
                    src: ["js/src/**/*.js"]
                },
                options: {
                    jshintrc: ".jshintrc"
                }
            }
        },

        //building

        handlebars: {
            options: {
                namespace: "qwebirc.templates",
                compilerOptions: {
                    knownHelpers: {
                        "check": true,
                        "enableDisable": true,
                        "$link": true,
                        "format": true,
                        "lang": true,
                        "$timestamp": true,

                        //mcss vars
                        "$result": true,
                        "$hex": true,
                        "$mix": true,
                        "$saturate": true,
                        "$lighten": true,
                        "$hue": true,
                        "vendor-prefix": true
                    },
                    knownHelpersOnly: true,
                    data: config.templates
                },
                wrapped: true,
                node: false,
                // amd: true,
                processContent: function(content) {//remove whitespace
                    var mark_open = "\x08openstr\x08";
                    var match_open = " {{";
                    var mark_close = "\x08closesstr\x08";
                    var match_close = "}} ";
                    //prevent }} } from being joint to {{{ or }}} which will break the handlebars parser
                    content = content.replace(/\{[\x20\t\n\r]+\{\{/g, mark_open)
                                    .replace(/\}\}[\x20\t\n\r]+\}/g, mark_close);

                    content = content.replace(/^[\x20\t]+/mg, "")
                                    .replace(/[\x20\t]+$/mg, "")
                                    .replace(/[\r\n]/g, "");//remove line breaks (for min)

                    content = content.split(mark_open).join(match_open)
                                    .split(mark_close).join(match_close);

                    return content;
                },

                processName: function(filename) {
                    return filename.substring(filename.lastIndexOf("/") + 1, filename.length-4);//last dash to the end of string (sub .hbs)
                }
            },

            main: {
                files: files.templates.main
            },
            panes: {
                files: files.templates.panes
            }
        },

        concat: {
            "apply-suffixes": {
                files: {
                    "dist/js/qwebirc<%= suffix %>.js": "dist/js/qwebirc.js",
                    "dist/js/modules<%= suffix %>.js": "dist/js/modules.js",
                    "dist/js/plugins<%= suffix %>.js": "dist/js/plugins.js",
                    "dist/js/templates<%= suffix %>.js": "dist/js/templates.js",

                    "dist/css/qwebirc<%= suffix %>.css": "dist/css/qwebirc.css",

                    "dist/css/bootstrap-<%= pkg['frontend-dependencies'].twbs.version %>.css": "dist/css/bootstrap.css"
                }
            },

            qweb: {
                options: {
                    banner: "(function(window, document, undefined) {\n\"use strict;\"",
                    footer: "})(window, document);",

                    process: {
                        data: templateContext
                    }
                },
                // the files to concatenate
                src: "dist/js/qwebirc.js",
                // the location of the resulting JS file
                dest: "dist/js/qwebirc.js"
            },

            config: {
                options: {
                    process: {
                        data: templateContext
                    }
                },
                files: {

                    "dist/js/app.js": "configure/config.js"
                }
            },

            full: {
                src: files.full,
                dest: "dist/js/qwebirc-full<%= suffix %>.js"
            },

            modifiablecss: {
                src: "mcss/*.hbs",
                dest: "templates/modifiablecss.hbs"
            },

            plugins: {
                src: files.plugins,
                dest: "dist/js/plugins.js"
            }
        },

        concat_in_order: {
            qweb: {
                options: {
                    depends_re: /\*\s*@depend(s)?\s+(\[(.*)\]|(.*)\s)/g,  //matches * @depend [ui/StandardUI, util/lang] or @depends ui/StandardUI
                    provide_re: /\*\s*@provide(s)?\s+(\[(.*)\]|(.*)\s)/g, //matches * @provide [ui/StandardUI, util/lang] or @provdes ui/STandardUI
                    getMatches: function ( regex, content ) {
                        var matches = [], match;
                        while (( match = regex.exec(content) )) {
                            matches.push(match);
                        }
                        return matches;
                    },
                    flatten: function(array) {
                        return Array.prototype.concat.apply([], array);
                    },
                    extract: function(regex, content) {
                        return this.flatten(this.getMatches(regex, content).map(function(match) {
                            if(match[3]) {
                                return match[3].replace(/\s/g, "").split(",").filter(Boolean); //handle comma deliminated dependencies
                            }
                            return match[4];
                        })).map(function(path) {
                            return path.toLowerCase();
                        });
                    },
                    extractRequired: function(filepath, content) {
                        var deps = this.extract(this.depends_re, content);
                        return deps;
                    },
                    extractDeclared: function(path, content) {
                        var deps = this.extract(this.provide_re, content);
                        return deps;
                    }
                },
                files: {
                    "dist/js/qwebirc.js": ["js/src/**/*.js"]
                }
            }
        },

        uglify: {
            options: {
                mangle: !!build.minify,
                compress: {
                    dead_code: true,
                    drop_console: !!build.debug
                },
                preserveComments: "none",
                beautify: !build.minify,
                ast_lift_variables: true,

                banner: [
                    "/*!",
                    "<%= pkg.name %> ::: Version <%= pkg.version %> :::",
                    "Built on <%= grunt.template.today('yyyy-mm-dd') %>",
                    "Description: <%= pkg.description %>",
                    "Authors: <%= pkg.author.name %> (<%= pkg.author.url %>)",
                    "Repository: <%= pkg.repository %>",
                    "\nThis project is a fork of <%= pkg.fork.name %> (<%= pkg.fork.url %>) by <%= pkg.fork.author %>",
                    "\n\nLicence: <%= pkg.licence.type %> - <%= pkg.licence.url %>",
                    "<%= grunt.file.read(pkg.licence.file) %>",
                    "*/\n"
                ].join("\n")
            },
            templates: {
                options: {
                    mangle: true,
                    beautify: false,
                    enclose: undefined,

                    banner: "//qwebirc v<%= pkg.version %> core templates\n"
                },
                files: {
                    "dist/js/templates.js": files.templates.qwebirc
                }
            },

            plugins: {
                options: {
                    // beautify: false,
                    banner: "/*App plugins see: github.com/megawac/qwebirc-enhancements/tree/master/js/libs*/\n"
                },
                files: {
                    "dist/js/plugins.js": files.plugins
                }
            },
            modules: {
                options: {
                    banner: "",
                    beautify: false,
                    preserveComments: "some"
                },
                files: {
                    "dist/js/modules.js": files.modules
                }
            },
            qweb: {
                files: {
                    "dist/js/qwebirc.js": "dist/js/qwebirc.js"
                }
            },
            config: {
                options: {banner: ""},
                files: {
                    "dist/js/app.js": "dist/js/app.js"
                }
            }
        },

        less: {
            twbs: {
                options: {
                    strictMath: true,
                    ieCompat: true
                },
                files: {
                    "dist/css/bootstrap.css": "less/bootstrap.less"
                }
            },
            qwebirc: {
                options: {
                    strictMath: true,

                    modifyVars: {
                        "jQuery-images": "'" + (build["use cdn"] ? files.resources["jQuery-images"].cdn : files.resources["jQuery-images"].local) + "'"
                    }
                },
                files: {
                    "dist/css/qwebirc.css": "less/qwebirc.less"
                }
            }
        },

        cssmin: {
            options: {
                preserveComments: "some",
                banner: [
                    "/*!",
                    " * <%= pkg.name %> ::: Version <%= pkg.version %> ::: <%= pkg.repository %>",
                    " * Authors: <%= pkg.author.name %> (<%= pkg.author.url %>)",
                    " */"
                ].join("\n")
            },
            combine: {
                files: {
                    "dist/css/qwebirc.css": ["dist/css/qwebirc.css"]
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: ["ie > 7", "firefox > 10", "chrome > 5", "safari > 5", "Opera > 10", "bb > 10", "iOS > 10"]
            },
            qweb: {
                src: "dist/css/qwebirc.css",
                dest: "dist/css/qwebirc.css"
            },
        },

        csscomb: {
            options: {
                config: "less/.csscomb.json"
            },
            dist: {
                files: {
                    "dist/css/bootstrap-<%= pkg['frontend-dependencies'].twbs.version %>.css": "dist/css/bootstrap-<%= pkg['frontend-dependencies'].twbs.version %>.css",
                    "dist/css/qwebirc.css": "dist/css/qwebirc.css"
                }
            }
        },

        htmlbuild: {
            qweb: {
                src: "configure/index.tmpl",
                dest: "index.html",
                options: {
                    beautify: {
                        "max_preserve_newlines": -1
                    },
                    relative: false,
                    data: templateContext,
                    scripts: {
                        modules: [templateContext.getFileURL("modules")],
                        bundle: build.concat ? ["dist/js/qwebirc-full<%= suffix %>.js"] : files.full,
                        config: ["dist/js/app.js"]
                    },
                    styles: {
                        bundle: [
                            "dist/css/bootstrap-<%= pkg['frontend-dependencies'].twbs.version %>.css",
                            "dist/css/qwebirc<%= suffix %>.css"
                        ]
                    }
                }
            }
        },

        release: {
            options: {
                bump: true,
                tag: true,
                push: true,
                pushTags: true,
                npm: false,
                tagName: "v-<%= version %>", //default: "<%= version %>"
                commitMessage: "Dropping v-<%= version %>", //default: "release <%= version %>"
                github: {
                    repo: "megawac/qwebirc-enhancements", //put your user/repo here
                    usernameVar: "GITHUB_USER", //ENVIRONMENT VARIABLE that contains Github username 
                    passwordVar: "GITHUB_PASS" //ENVIRONMENT VARIABLE that contains Github password
                }
            }
        },

        file_info: {
            source_files: {
                src: files.full.concat([
                    "dist/js/modules.js", "dist/js/templates.js", "dist/js/plugins.js", "dist/js/qwebirc.js",
                    "dist/css/qwebirc.css", "dist/css/bootstrap.css"
                ]),
                options: {
                    stdout: build.report
                }
            }
        }
    });

    // load all grunt tasks
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.registerTask("server", ["express:testing"]);

    grunt.registerTask("test", [
        "jshint",
        "build-templates",
        "build-js",
        "server",
        "mocha"
    ]);

    grunt.registerTask("build-templates", [
        "concat:modifiablecss",
        "handlebars",
        "uglify:templates"
    ]);

    grunt.registerTask("build-js", function() {
        grunt.task.run([
            "concat_in_order:qweb", //build the files in the correct order
            "concat:qweb",          //prep and remove unnessary stuff - ie say we"re on node don"t include twisted stuff - if channel lists are disabled don"t include files etc
            "concat:config",
            "uglify:modules",
            "uglify:plugins"
        ]);

        if (!build.debug) {
            grunt.task.run(["uglify:qweb", "uglify:config"]);
        }
    });

    grunt.registerTask("build-css", function() {
        grunt.task.run("less");
        grunt.task.run("csscomb");
        grunt.task.run("autoprefixer");

        if(build.minify) {
            grunt.task.run("cssmin");
        }
    });

    grunt.registerTask("build-html", function() {
        if(package.concat) {
            grunt.task.run("concat:full");
        }
        grunt.task.run("htmlbuild:qweb");
    });

    grunt.registerTask("build", function(prefix) {
        grunt.config.set("suffix", prefix || grunt.config.getRaw("suffix") + grunt.template.today("-mmddHHMM"));
        grunt.task.run([
            "build-templates",
            "build-js",
            "build-css",
            "concat:apply-suffixes",
            "build-html"
        ]);
        if (build.report) grunt.task.run("file_info");
    });

    grunt.registerTask("release", ["build", "release"]);

    grunt.registerTask("default", ["build"]);
};
