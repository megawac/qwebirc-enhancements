qwebirc-mods  
=============  

![logo](https://raw.github.com/megawac/qwebirc-enhancements/master/images/qwebircsmall.png "QWebirc logo")
Qwebirc is intended to be a simple, intuitive and full-featured IRC client that operated out of the clients browser. This *fork* of Chris Porter's [qwebirc](http://qwebirc.org/) is a complete rewrite of the project in order to introduce more customability, add features introduced with HTML5, improve the extensibility of the code and revamp the ui. I began this project when I became frustrated trying to create a plugin atop of Qwebirc; flexibility and extensibility are two of the main focuses of the changes. I have also added multiple features, made code quality improvements, bug fixes, etc. Been working on this for a couple months, the plugin is almost stable, come play with it  ([Screenshot](http://puu.sh/4ANPf.png)).  
  
  
##Status
Code is almost stable - planning to release a version commit shortly. Currently fixing some browser bugs before release.  
####Done:  
* improved extendibility through modularization and refactoring
* ui client relationship event driven and moving important functions to utils. Makes implementing extensions much simpler
 * redid url parser to be easier to add patterns
 * reduced network bandwidth load
* various new ui features and fixes (some mentioned below)
 * detachable windows and resizable components
 * fixed tab overflow not showing
 * stable scrolling implementation
* code quality improvements (more dry and intuitive and less hacky)
 * join-flood detection
 * Rewrote ui using mv* style
* rewrote irc colouriser and moved to theme
* rewrote and improved urlifier and moved to theme + module
* moved modifiable css to a precompiled handlebars template
* fix some memory leaks
* moved all panes to seperate modules (havent rewritten the embed wizard)
* mocked up new input bar see screenshot above
  
####TODOs:  
* add options for:
 * configure notification type per option (in works)
 * store commands between sessions
 * configure hotkeys
* Process lines for brouhaha and the proper window once
* Finish implementing the BaseUI in empitome
* Finish Drag.SplitPane module (issues with keeping relative pos with window resizes) {{link to repo}}
  
  
####KNOWN BUGS:  
* Opera ui is bugged due to https://github.com/mootools/mootools-core/issues/2325
* __ie7 isnt rendering__ the site according to webpagetest.org. please send help or maple syrup  
* old drag.splitpane doesnt work on ff reimplementing  

####Future Goals 
* make client portable enough to be enabled as an overlay  
* amd support  


##DEMO:  
I currently have an instance running for the gamesurge network at: [qwebirc.herokuapp.com](http://qwebirc.herokuapp.com/)  
Note: heroku doesnt (stabally) support websockets so its using xhr long polls :/  
  
To run the demo:  
#####Twisted
 1.  optionally run grunt in base
 2.  Run demo\twisted python run.py
 3.  Navigate to 127.0.0.1:9090

#####Node
 1.  optionally run grunt in base
 2.  Run demo\node -> node config
 3.  Navigate to 127.0.0.1:8080
 
#### Configuration
To configure cuustom settings see options in `\js\src\ui\Interface.js` (set through `index.html` call or in that file) and see custom configuration defaults at `js\src\config`; including: command formats, options, theme templates and settings  

####Making Changes:  
To make changes to the static files make them in the base directory and run ```grunt``` in the command line. Use ```npm install``` if this is your first change.  