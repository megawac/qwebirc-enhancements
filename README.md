qwebirc-mods  
=============  

Complete rewrite of Chris Porter's qwebirc (qwebirc.org) - added multiple features, code quality improvements, bug fixes, etc.  
Been working on this for a couple months, the connection and client are now stable but the ui needs work.  
  
Extension runs on:  
    -webchat.quakenet.org  
    -webchat.gamesurge.net  
    -atf2.org  
  
  
Done:  
-improved extendibility  
	-(started to make) ui client relationship event driven and moving important functions to utils  
    	-redid url parser to be easier to add patterns  
        -reduced network bandwidth load  
    -various new ui features and fixes  
	-fixed tab overflow not showing  
    	-better scrolling implementation  
        -code quality improvements (more dry and intuitive and less hacky)  
    -join-flood detection   
    -Rewrote options using mv* style  
-rewrote irc colouriser and moved to theme  
-rewrote urlifier and moved to theme + module  
  
  
TODOs:  
-fix split panes   
-add options for:  
    -notifying on selected text/regex  
        -configure notification type per option  
        -store commands between sessions  
        -configure hotkeys  
        -write tab styles for options page and maybe rewrite the tabifier for all windows  
-create hotkey handlers using keyboard interface  
-move the embedded wizard to a seperate module (to be imported like privacy pol etc)  
-finish decoupling client from ui  
-write socket connection class for when available - needs server coded as well.  
-fixes for all my blunders  
-get rid of compile.py + dependencies  
  
  
KNOWN BUGS:  
-Opera ui is bugged due to https://github.com/mootools/mootools-core/issues/2325  
-Split panes are buggy (disabled currently)  
-urls arent being matched if they are coloured eg \x03www.google.ca\x03  
    -move prefix patterns to seperate function and take regex class [\x03-\x15] or something  
