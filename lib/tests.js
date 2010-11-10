var by = require("./util").By;
var Session = require("./session").Session;
var when = require('promised-io/promise').when;

var json = require("commonjs-utils/json");
var print = require('promised-io/process').print;
var pshallow = require("./util").pshallow;

exports.tests= require("../tests/api");

if(require.main == module){
	require("patr/runner").run(exports.tests);
}

