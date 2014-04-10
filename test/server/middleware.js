/* jshint node:true */

//Any server endpoints the tests need supported

module.exports = function(connect, options, middlewares) {
    middlewares.push(function(req, res, next) {
        if (req.url !== "/lang") {
            return next();
        }
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.end(require("/lang/base.json"));
    });
    return middlewares;
};