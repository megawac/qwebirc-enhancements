/**
 * quick console shim https://gist.github.com/bgrins/5108712
 */
(function(console, noop) {
    [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ].forEach(function(method) {
        // Only stub undefined methods.
        if(!console[method]) console[method] = noop;
    });
})(window.console = window.console || {}, function() {});