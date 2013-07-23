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
  
  
TODOs:  
-fix split panes  
-redo colouriser  
-rewrite options config  
    -get rid of the table layout stuff  
    -rewrite the uiOptions weird structure  
    -add options for:  
        -notifying on selected text/regex  
        -configure notification type per option  
        -store commands between sessions  
        -configure hotkeys  
-create hotkey handlers  
-move the wizard to a seperate module (to be imported like privacy pol etc)  
-finish decoupling client from ui  
-write socket connection class for when available - needs server coded as well.  
-fixes for all my blunders
