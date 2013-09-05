qwebirc-mods  
=============  

Complete rewrite of Chris Porter's qwebirc (qwebirc.org) - added multiple features, code quality improvements, bug fixes, etc.  
Been working on this for a couple months, the connection and client are now stable but the ui needs work.  
  
##Demo:
I currently have an instance running for the gamesurge network at: http://qwebirc.herokuapp.com/
Note: heroku doesnt support websockets so its using xhr long polls :/ 

##Done:  
-improved extendibility  
    -(started to make) ui client relationship event driven and moving important functions to utils  
        -redid url parser to be easier to add patterns  
        -reduced network bandwidth load  
    -various new ui features and fixes  
        -ie detachable windows and resizable components  
    -fixed tab overflow not showing  
        -better scrolling implementation  
        -code quality improvements (more dry and intuitive and less hacky)  
    -join-flood detection   
    -Rewrote options and windows using mv* style  
-rewrote irc colouriser and moved to theme  
-rewrote urlifier and moved to theme + module  
-moved modifiable css to a precompiled handlebars template  
-fix some memory leaks

  
##TODOs:  
-add options for:  
    -notifying on selected text/regex  
        -configure notification type per option  
        -store commands between sessions  
        -configure hotkeys  
        -write tab styles for options page and maybe rewrite the tabifier for all windows  
-create hotkey handlers using keyboard interface and make configurable  
-move the embedded wizard to a seperate module (to be imported like privacy pol etc)  
-finish decoupling client from ui (90% there)  
-write socket connection class for when available - needs server coded as well.   
-Process lines for brouhaha and the proper window once  
  
  
##KNOWN BUGS:  
-Opera ui is bugged due to https://github.com/mootools/mootools-core/issues/2325  
-urls arent being matched if they are coloured eg \x03www.google.ca\x03  
    -move prefix patterns to seperate function and take regex class [\x03-\x15] or something  
-Notices are sent to the wrong window (always to status window...)  

##End Goals (some day...):  
-make client portable enough (maybe with mootools and jquery amd versions) to be enabled as an overlay  
-make client ui easily extensible by just simple MV* view configuration  

##DEMO:  
To run the demo:  
1) optionally run grunt in base  
2) Start demo\run.py  
3) Navigate to 127.0.0.1:9090  
  
Code is almost stable. Currently finishing remimplementing and bug testing some features and it should be ready for production. I hope to get a server up with the app soon - money's short :(.