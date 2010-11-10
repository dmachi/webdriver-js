var by = require("../lib/util").By;
var Session = require("../lib/session").Session;
var when = require('promised-io/promise').when;

var json = require("commonjs-utils/json");
var print = require('promised-io/process').print;
var pshallow = require("../lib/util").pshallow;

var assert = require("assert");

exports.testStartSession = function(){
	var browserName = "firefox";
	var url = "http://192.168.5.16:4444/wd/hub"; 

	var session = new Session({url: url});
	var capabilities = session.startSession({browserName: browserName});
	var url = "http://www.google.com/";

	return when(capabilities,function(capabilities){
		assert.equal(capabilities.browserName, browserName);

		return when(session.get(url), function(){
			return when(session.getCurrentUrl(), function(currentUrl){
				assert.equal(currentUrl, url);	
				session.quit();
			});
		});
	});
}

exports.testScreenshot = function(){
	var browserName = "firefox";
	var url = "http://192.168.5.16:4444/wd/hub"; 

	var session = new Session({url: url});
	var capabilities = session.startSession({browserName: browserName});
	var url = "http://www.google.com/";

	return when(capabilities,function(capabilities){
		assert.equal(capabilities.browserName, browserName);

		return when(session.get(url), function(){
			return when(session.getScreenshot("BASE64"), function(img){
				assert.notEqual(img.length, 0);
				session.quit();
			});
		});
	});
}

/*
		nav.then(function(){
			
			return when(session.findElement(by.linkText("Make Google my homepage")), function(element){
				var el = element;
	

				el.getInnerText().then(function(response){
					print("innerText: " + json.stringify(response.value));
				});		


				el.getTagName().then(function(response){
					print("tagName: " + json.stringify(response.value));
				});		

				el.click();
			});
		});
	*/
	
	/*
	nav.then(function(){
		return when(session.findElements(by.tagName("a")), function(elements){
			elements.forEach(function(el){
				print("Got <a> element: ", el);
			})
		});
	});
	*/

	/*
	nav.then(function(){
		print("Execute script...");

		return when(session.executeScript('(function(w){return {foo: "bar"}})(this)'),function(execResults){
			print("   - type of result: " + typeof execResults);
			print(execResults.foo);
		},function(err){
			print("Unable to execute script: " + err);
			return err;
		});
	});
	*/

