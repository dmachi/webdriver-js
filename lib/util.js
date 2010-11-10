var parseUrl = require("url").parse;
var when = require('promised-io/promise').when;
var json = require("commonjs-utils/json");
var print = require('promised-io/process').print;
var xhr = require("promised-io/http-client");

var By = exports.By = { 
	className : function(param){
		return {using: "class name", "value": param}
	},
	cssSelector: function(param){
		return {using: "css selector", "value": param}
	},
	query: function(param){
		return {using: "css selector", "value": param}
	},
	id: function(param){
		return {using: "id", "value": param}
	},
	linkText: function(param){
		return {using: "link text", "value": param}
	},
	name: function(param){
		return {using: "name", "value": param}
	},
	partialLinkText: function(param){
		return {using: "partial link text", "value": param}
	},
	tagName: function(param){
		return {using: "tag name", "value": param}
	},
	xpath: function(param){
		return {using: "xpath", "value": param}
	}
}

var pshallow = exports.pshallow=function(obj){
	for (var i in obj){
		try {
		if (typeof obj[i]=="object" ||typeof obj[i]=="function"){
			print("obj[" + i + "]" + typeof obj[i]);
		}else{
			if ((typeof obj[i]=='string')||(obj[i] && obj[i].toString)) {
				print("obj[" + typeof obj[i] + "[" + i + "]" + obj[i]);
			}else if (typeof obj[i]=="boolean") { 
				print("obj[" + i + "]" + obj[i]);
		
			}else{
					print("*obj[" + i + "]" + typeof obj[i]);
			}
		}
		}catch(e){
			print("Error on: " + i);
		}
	}
}

//shallow mixin
var mix = exports.mix = function(){
	var base = arguments[0];
	for (var i=0; i<arguments.length; i++){
		for (var prop in arguments[i]){
			base[prop]=arguments[i][prop];
		}
	}
	return base;
}

//wonder if i should be doing this on my own?
var strip = function strip(str){
	var x=[];
	for(var i in str){
		if (str.charCodeAt(i)){
			x.push(str.charAt(i));
		}
	}
	return x.join('');
}

var responseHandler=function(response){
	//print("responseHandler() " + response.status + " type: "+ typeof response.status);
	if (response.status >= 500){
		return response;
	}

	if (response.status >= 400){
		return new response;
	}

	if (response.status >= 300){
		return response;
	}

	if (response && response.body){
		return when(response.body.join(""), function(body){ 
			var body = strip(body);
			if (body.length>2) {
				var r = json.parse(strip(body));
				if (r && r.value) { return r.value; } else { return r; }
			}else{
				return null;
			}
		});
	}
}

var GETHeaders={
	accept: "application/json;charset=utf-8",
	"content-type": "application/json;charset=utf-8"
}

var POSTHeaders={
	"accept": "application/json;charset=utf8",
	"content-type": "application/json;charset=utf8"
}
var GET=exports.GET=function(request){
	var req= {
		url: request.url,
		method: "GET",
		headers: mix({},GETHeaders,{host: parseUrl(request.url).host}, request.headers)
	}

	//print("GET " + req.url);	
	return when(xhr(req),responseHandler);
}

var DELETE=exports.DELETE=function(request){
	var req= {
		url: request.url,
		method: "DELETE",
		headers: mix({},GETHeaders,{host: parseUrl(request.url).host}, request.headers)
	}
	
	return when(xhr(req),responseHandler);
}

var POST=exports.POST=function(request){
	var req= {
		url: request.url,
		method: "POST",
		headers: mix({},POSTHeaders,{host: parseUrl(request.url).host}, request.headers)
	}
	//print("POST: " + request.body);
	//print("type: " + typeof request.body);

	//print("POST " + req.url);	
	if (request.body) {
		return when(request.body, function(body){
			req.headers['Content-Length']=(body && body.length)?body.length:"";
			req.body = [body];
			return when(xhr(req),responseHandler);
		})
	}else{
		return when(xhr(req),responseHandler);
	}
}

