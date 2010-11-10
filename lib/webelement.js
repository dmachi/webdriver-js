var when = require('promised-io/promise').when;
var json = require("commonjs-utils/json");

var GET = require("./util").GET;
var POST = require("./util").POST;
var DELETE = require("./util").DELETE;
var mix = require("./util").mix;

var pshallow= require("./util").pshallow;
var print = require('promised-io/process').print;

var WebElement = exports.WebElement = function(el, session){
	mix (this, el);
	this.session = session;
	this.elementUrl = this.session.sessionUrl + "/element/" + this.ELEMENT;
}

WebElement.prototype = {
	toString: function(){
		return "[WebElement " + this.elementUrl+ "]"
	},
	describe: function(){
		return GET({
			url: this.elementUrl
		});
	},
	findElement: function(query){
		var _self=this;
		return POST({
			url: this.elementUrl + "/element",
			body: json.stringify(query)
		});
	},
	findElements: function(query){
		return POST({
			url: this.elementUrl + "/elements",
			body: json.stringify(query)
		});
	},
	click: function(){
		return POST({
			url: this.elementUrl + "/click"
		});
	},
	submit: function(){
		return POST({
			url: this.elementUrl + "/submit"
		});
	},
	getInnerText: function(){
		return GET({
			url: this.elementUrl + "/text"
		});
	},
	getValue: function(){
		return GET({
			url: this.elementUrl + "/value"
		});
	},
	getTagName: function(){
		return GET({
			url: this.elementUrl + "/name"
		});
	},
	clear: function(){
		return POST({
			url: this.elementUrl + "/clear"
		});
	},
	selected: function(set){
		if (set){
			return POST({
				url: this.elementUrl + "/selected"
			});
		}else{	
			return GET({
				url: this.elementUrl + "/selected"
			});
		}
	},
	toggle: function(){
		return POST({
			url: this.elementUrl + "/toggle"
		});
	},
	
	enabled: function(){
		return GET({
			url: this.elementUrl + "/enabled"
		});
	},
	getAttribute: function(name){
		if (!name){
			throw new Error("No property name supplied to WebElement.getAttribute()");
		}
		return GET({
			url: this.elementUrl + "/attribute/" + name
		});
	},
	equals: function(otherElementId){
		return GET({
			url: this.elementUrl + "/equals/"+otherElementId
		});
	},
	displayed: function(){
		return GET({
			url: this.elementUrl + "/displayed"
		});
	},
	"location": function(){
		return GET({
			url: this.elementUrl + "/location"
		});
	},
	
	locationInView : function(){
		return GET({
			url: this.elementUrl + "/location_in_view"
		});
	},
	
	size: function(){
		return GET({
			url: this.elementUrl + "/size"
		});
	},
	
	style: function(prop){
		return GET({
			url: this.elementUrl + "/css/" + prop
		});
	},

	hover: function(){
		return POST({
			url: this.elementUrl + "/hover"
		});
	},
	drag: function(x,y){
		return POST({
			url: this.elementUrl + "/drag",
			body: json.stringify({x: x, y: y})
		});
	}
}
