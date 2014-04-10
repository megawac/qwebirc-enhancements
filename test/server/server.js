"use strict";

var express = require("express");
var app = express();

var base = require("path").resolve(__dirname, "../../");

function middleware(req, res, next) {
    if (req.url !== "/lang") {
        return next();
    }
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    res.write(JSON.stringify(require(base + "/lang/base.json")));
    res.end();
}

app.use(middleware);
app.use(express.static(base));

module.exports = app;