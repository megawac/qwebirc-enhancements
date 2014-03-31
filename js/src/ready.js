/**
 * Promise based ready controller to indicate the app can start loading
 *
 * @depends [qwebirc, util/lang]
 * @provides [ready, qwebirc/ready]
 */

//qwebirc.js defines readyPromises = []
/* global readyPromises */
readyPromises.push(new Promise(function(fulfill) {
    document.addEvent("domready", fulfill);
}));

var qwebircReadyPromise = Promise.all(readyPromises);

// qwebirc.ready = function(cb/*, args*/) {
//     return qwebircReadyPromise.then(_.partial.apply(_, [cb].concat(_.rest(arguments))));
// };
qwebirc.ready = function(cb/*, args*/) {
    return qwebircReadyPromise.then(cb.pass(_.rest(arguments), this));
};
