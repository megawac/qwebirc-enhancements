/*****************************
Build step. See settings under build in build.json

Flags:
-"minify": use uglify to minimize js size
-"concat": place css and js all in the same file.
-"use cdn": load files from a cdn where applicable
-"node server": include files for a node server
-"twisted server": include files for a twisted server (currently will break if "node server" is truthy)
*****************************/
/* jshint node:true */
module.exports = function(grunt) {
    var path = require("path");
    var package = grunt.file.readJSON("./package.json");
    var build = grunt.file.readYAML("./build.yml");
    var files = grunt.file.readYAML("./build-files.yml");
    var templateContext = {
        package: package,
        pkg: package,
        build: build,
        files: files,
        getFileURL: function(resource) {//load path to resource
            var resc = files.resources[resource];
            if(build["use cdn"] && resc.cdn) {
                return build.minify ? resc["cdn min"] : resc.cdn;
            } else {
                return build.minify ? resc["local min"] : resc.local;
            }
        }
    };

    package.build = build;

    grunt.initConfig({
        pkg: package,
        build: build,
        meta: {},

        handlebars: {
            options: {
                namespace: "qwebirc.templates",
                compilerOptions: {
                    knownHelpers: {
                        "check": true,
                        "$css": true,
                        "enableDisable": true,
                        "$link": true,
                        "format": true,
                        "lang": true
                    },
                    knownHelpersOnly: true
                },
                wrapped: true,
                node: false,
                // amd: true,
                processContent: function(content) {//remove whitespace
                    content = content.replace(/^[\x20\t]+/mg, "")
                                    .replace(/[\x20\t]+$/mg, "")
                                    .replace(/\r\n/g, "");//remove line breaks (for min)
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
            options: {
                // define a string to put between each file in the concatenated output
                separator: "\n"
            },
            qweb: {
                options: {
                    banner: "(function(window, document, undefined) {",
                    footer: "})(window, document);"
                },
                // the files to concatenate
                src: files.qwebirc,
                // the location of the resulting JS file
                dest: "js/dist/qwebirc-<%= pkg.version %>.js"
            },

            full: {
                src: files.full,
                dest: "js/dist/qwebirc-full-<%= pkg.version %>.js"
            },

            css: {
                src: "css/src/*.css",
                dest:"css/qwebirc-<%= pkg.version %>.css"
            },

            modifiablecss: {
                src: "css/src/*.hbs",
                dest: "templates/modifiablecss.hbs"
            },

            plugins: {
                src: files.plugins,
                dest: "js/dist/plugins-<%= pkg.version %>.js"
            }
        },

        concat_in_order: {
            qweb: {
                options: {
                    regex: /\*\s*(\w+:\s*)?@depend(s)?\s(.*\.js)/g,
                    index: 3,
                    getMatches: function (content) {
                        var matches = [], match;
                        while (( match = this.regex.exec(content) )) {
                            if(match[this.index]) matches.push(match[this.index]);
                        }
                        return matches;
                    },
                    extractRequired: function(filepath, filecontent) {
                        var workingdir = path.normalize(filepath).split(path.sep);
                        workingdir.pop();
                        var deps = this.getMatches(filecontent);
                        return deps.map(function(dep) {
                            if( dep.charAt(0) === "/" ) {//absolute path
                                return path.normalize("js/src" + dep);
                            }
                            var dependency = workingdir.concat([dep]);
                            return path.join.apply(null, dependency);
                        });
                    },
                    extractDeclared: function(filepath) {
                        return [filepath];
                    },
                    onlyConcatRequiredFiles: true
                },
                files: {
                    "js/dist/concatenated.js": ["js/src/Interface.js"]
                }
            }
        },

        uglify: {
            options: {
                mangle: build.minify,
                compress: {
                    dead_code: true
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

                    banner: "//qwebirc v<%= pkg.version %> templates\n"
                },
                files: {
                    "js/dist/templates-<%= pkg.version %>.js": files.templates.qwebirc
                }
            },

            plugins: {
                options: {
                    banner: "/*App plugins see: github.com/megawac/qwebirc-enhancements/tree/master/js/libs*/\n"
                },
                files: {
                    "js/dist/plugins-<%= pkg.version %>.js": files.plugins
                }
            },
            qweb: {
                files: {
                    "js/dist/qwebirc-<%= pkg.version %>.js": "js/dist/qwebirc-<%= pkg.version %>.js"
                }
            },
            full: {
                files: {
                    "js/dist/qwebirc-full-<%= pkg.version %>.js": files.full
                }
            },
            config: {
                options: {banner: ""},
                files: {
                    "js/dist/app-<%= pkg.version %>.js": "configure/config.js"
                }
            }
        },

        template: {
            qweb: {
                options: {
                    data: templateContext
                },
                files: {
                    "js/dist/qwebirc-<%= pkg.version %>.js": ["js/dist/qwebirc-<%= pkg.version %>.js"]
                }
            }
        },

        cssmin: {
            combine: {
                files: {
                    "css/qwebirc-<%= pkg.version %>-min.css": ["css/src/*.css"]
                }
            }
        },

        htmlbuild: {
            qweb: {
                src: "configure/index.tmpl",
                dest: "index.html",
                options: {
                    beautify: true,
                    relative: false,
                    data: templateContext,
                    scripts: {
                        bundle: build.concat ? ["js/dist/qwebirc-full-<%= pkg.version %>.js"] : files.full,
                        config: ["js/dist/app-<%= pkg.version %>.js"]
                    },
                    styles: {
                        bundle: build.minify ? ["css/qwebirc-<%= pkg.version %>-min.css"] : ["css/qwebirc.css"]
                    }
                }
            }
        },

        bumpup: {
            file: "package.json"
        },
        tagrelease: {
            file: "package.json",
            commit:  true,
            message: "v-%version%"
        }
    });


    // load all grunt tasks
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.registerTask("build-templates", [
        "concat:modifiablecss",
        "handlebars",
        "uglify:templates"
    ]);

    grunt.registerTask("build-js", [
        "concat:qweb", //has to be concatted first for the iffe
        "concat_in_order:qweb",
        "template:qweb", //remove unnessary stuff - ie say we"re on node don"t include twisted stuff - if channel lists are disabled don"t include files etc

        "uglify:plugins",
        "uglify:qweb",
        "uglify:config"
    ]);

    grunt.registerTask("build-css", function() {
        grunt.task.run("concat:css");

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

    grunt.registerTask("build", [
        "build-templates",

        "build-js",

        "build-css",

        "build-html"
    ]);

    grunt.registerTask("default", ["build"]);

    grunt.registerTask("release", function (type) {
        type = type ? type : "patch";
        grunt.task.run("build");
        grunt.task.run("bumpup:" + type); // Bump up the package version
        grunt.task.run("tagrelease");     // Commit & tag the changes from above
    });
};