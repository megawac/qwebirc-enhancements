qwebirc-mods [![Build Status](https://travis-ci.org/megawac/qwebirc-enhancements.svg)](https://travis-ci.org/megawac/qwebirc-enhancements)
=============  

<img align="right" height="125" src="https://raw.github.com/megawac/qwebirc-enhancements/master/images/qwebircsmall.png">
Qwebirc is intended to be a simple, intuitive and feature rich IRC client that operates out of the browser. This spiritual *fork* of Chris Porter's [qwebirc](http://qwebirc.org/) is a complete rewrite of the project in order to introduce more customability, add features introduced with HTML5, improve the extensibility of the code and revamp the ui (still qui). I began this project when I became frustrated trying to create a plugin atop of Qwebirc; flexibility and extensibility are two of the main focuses of the changes. I have also added multiple features, made code quality improvements, bug fixes, etc. Here's a ([Screenshot](http://puu.sh/4ANPf.png) [Screenshot 2](http://i.imgur.com/9Cee1iO.jpg)) of a live instance.  

**This is undergoing active development - a RC build is being staged**
 
## Installation:  

- Install [node.js](http://nodejs.org)
- Configure the qwebirc instance settings as described in [configuration](#configuration)
- Install development build dependencies using `npm install` in the base folder (reads in package.json)
- Run `grunt` to build static files
- Start up a `qwebirc` or `iris` server with this repo set as the static files see #Server. For testing I personally use the server in [`test/server`](https://github.com/megawac/qwebirc-enhancements/blob/master/test/server/run.js) with the `base_url`s set to a live instance

#### Making changes
After making changes to source files run in the base directory and run `grunt` in the command line to recompile resources.

### Configuration
You can set compile settings either in the gruntfile manually or setting the compile presets in [`app-config.yml`](https://github.com/megawac/qwebirc-enhancements/blob/master/app-config.yml) and [`build.yml`](https://github.com/megawac/qwebirc-enhancements/blob/master/build.yml). A similar build step to the old `compile.py` build is in the works (see #17)

Making changes to most source files will require you to rebuild via `grunt`
  
####TODOs: 
* Add options for:
 * (mid) configure hotkeys
* (major) Refactor python compile code to call appropriate Grunt build and set app options (#17)
  
  
####KNOWN BUGS:  
* __ie7 isnt rendering__ the site according to webpagetest.org. please send help or maple syrup  

##Server:  
Requires a light modification of either qwebirc or iris in order to support localization and switching the index file to `static.html`. See commits below if you don't want to use [my server fork](https://github.com/megawac/iris)
- Compile: [`ffba0d7b2772d2`](https://github.com/megawac/iris/commit/ffba0d7b2772d2a26dcd47a4f941f6b020e52254)
- Set index.html: [`83e67bf4b236e`](https://github.com/megawac/iris/commit/83e67bf4b236e532dcdcc7a8c9e6b7cb9f6ee4d9)
- Localization engine: [`fed82b8a6a4c9`](https://github.com/megawac/iris/commit/fed82b8a6a4c9168fda4ee12a657fde5bddfc337)

#### Twisted (or Iris)
I have an instance of the code running over twisted on the Geeks-IRC network at [geeks-irc.herokuapp.com](http://geeks-irc.herokuapp.com/)

(Outdated) Source code of the instance is on [this branch](https://github.com/megawac/iris/tree/Geeks-IRC)
