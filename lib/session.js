var when = require('promised-io/promise').when;
var json = require("commonjs-utils/json");

var WebElement = require("./webelement").WebElement;

var GET = require("./util").GET;
var POST = require("./util").POST;
var DELETE = require("./util").DELETE;
var mix = require("./util").mix;

var pshallow= require("./util").pshallow;
var print = require('promised-io/process').print;

var Session = exports.Session = function(options){
	this.options = options;
}

Session.prototype = {
	startSession: function(desiredCapabilities){
		var req={
			url: this.options.url + "/session",
			body: json.stringify({desiredCapabilities: desiredCapabilities})	
		}

		var _self=this;
		//print("startSession() ");
		//pshallow(req);	
		return when (POST(req), function(results){
			if (results.status=='302' || results.status=='303'){
				var sessionUrl = _self.sessionUrl = results.headers.location;	
				return when(GET({url: _self.sessionUrl}),function(response){
					//print("response handler for start Session: ", typeof response);
					//pshallow(response);
					_self.session = response;
					return response;
				});
			}
			return Error("startSession did not redirect to a new session url");
		});
	},

	get: function(url){
		return POST({
			url: this.sessionUrl + "/url",
			body: json.stringify({"url": url})

		});
	},

	executeScript: function(script, args){
		//print("executescript session: ", json.stringify(this.session));
		if (!this.session.value.javascriptEnabled){
			print("Javascript is not available in the active platform/browser driver");
		}else{
			return POST({
				url: this.sessionUrl + "/execute",
				body: json.stringify({'script': script, 'args': args||[]})
			});
		}
	},

	setImplicitWait: function(duration){
		POST({
			url: this.sessionUrl + "/timeouts/implicit_wait",
			body: json.stringify({ms: duration})
		});	
	},

	findElement: function(query){
		var _this = this;
		return when(POST({
			url: this.sessionUrl + "/element",
			body: json.stringify(query)
		}), function(response){
			return new WebElement(response.value, _this);
		});
	},

	findElements: function(query){
		var _this=this;
		return when(POST({
			url: this.sessionUrl + "/elements",
			body: json.stringify(query)
		}), function(response){
			return response.value.map(function(el){return new WebElement(el, this)},_this)
		});
	},

	getActiveElement: function(){
		var _this=this;
		when(GET({
			url: this.sessionUrl + "/element/active"
		}), function(response){
			return new WebElement(response.value, _this);
		});
	},

	getCapabilities: function(){
		return this.session.value;
	},

	getCurrentUrl: function(){
		return GET({
			url: this.sessionUrl + "/url"
		});
	},

	getScreenshot: function(type){
		return GET({
			url: this.sessionUrl + "/screenshot?outputType=" + type
		});
	},
	
	getPageSource: function(){
		return GET({
			url: this.sessionUrl + "/source"
		});
	},
	getTitle: function(){
		return GET({
			url: this.sessionUrl + "/title"
		});
	},
	getCookies: function(){
		return GET({
			url: this.sessionUrl + "/cookie"
		});
	},
	getSpeed: function(){
		return GET({
			url: this.sessionUrl + "/speed"
		});
	},

	setSpeed: function(speed){
		return POST({
			url: this.sessionUrl + "/speed",
			body: json.stringify({speed: speed})
		});
	},

	getWindowHandle: function(){
		return GET({
			url: this.sessionUrl + "/window_handle"
		});
	},
	getOrientation: function(){
		return GET({
			url: this.sessionUrl + "/orientation"
		});
	},
	
	getWindowHandles: function(){
		return GET({
			url: this.sessionUrl + "/window_handles"
		});
	
	},
	isJavascriptEnabled: function(){
		return this.session.value.javascriptEnabled;
	},
	manage: function(){
		print("NOT IMPLEMENTED:  manage()");
	},
	navigation: {
		back: function(){
			return POST({
				url: this.sessionUrl + '/back'
			});	
		},
		forward: function(){
			return POST({
				url: this.sessionUrl + '/forward'
			});	
		},
		refresh: function(){
			return POST({
				url: this.sessionUrl + '/refresh'
			});	
		}
	},
	quit: function(){
		return DELETE({
			url: this.sessionUrl
		});
	},
	close: function(){
		return DELETE({
			url: this.sessionUrl + "/window"
		});
	},
	deleteCookie: function(cookie){
		return DELETE({
			url: this.sessionUrl + "/cookie/" + cookie
		});
	},

	deleteAllCookies: function(cookie){
		return DELETE({
			url: this.sessionUrl + "/cookie"
		});
	},

	switchToFrame: function(nameOrIdOrIndex){
		return POST({
			url: this.sessionUrl + "/frame",
			body: json.stringify({id: nameOrIdOrIndex})			
		});	
	},
	switchToWindow : function(nameOrHandle){
		return POST({
			url: this.sessionUrl + "/window",
			body: json.stringify({name: nameOrHandle})			
		});	
	},
	toString: function(){
		return "[RemoteWebDriver Session" + this.sessionUrl + "]"
	}
}

