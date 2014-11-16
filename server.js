var express = require('express');

express().use(express.static(__dirname)).listen(80);

console.log("Webserver started at http://localhost/");