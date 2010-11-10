## webdriver-js

webdriver-js is a client for controlling webrowsers via WebDriver (formerly Google WebDriver, now the upcoming Selenium2 WebDriver).  The Selenium2 standalone server software can be installed on Mac, Windows, and Linux with a single JAR file.  The webdriver-js client connects to one or more instances, requests a new browser session (IE, Firefox, and Chrome currently), and then can remotely control the browser including sending keys and certain mouse events as well as execute arbitrary javascript on the browser and retrieve those results. 

### Setup

Download a copy of the standalone selenium server 2.x jar from http://code.google.com/p/selenium/downloads/list

Launch the selenium server:

java -jar selenium-server-standalone-2.0a7.jar

For projects that take advantage of nodules, adding webdriver-js to your project is as easy to add to package.json mappings like:

	mappings: {
		"webdriver-js": "jar:http://github.com/dmachi/webdriver-js/zipball/master!/lib/"
	}


### Run the existing tests:

Download http://github.com/dmachi/webdriver-js/zipball or git clone the repository.   With node in your path, launch the tests for the webdriver-js client itself by setting the NODULES env variable to your path to nodules.js or executing a command like from the root of the package:

NODULES=~/src/nodules/lib/nodules.js ./runTests.sh 

The tests can be run directly like:

/path/to/node  /path/to/nodules.js lib/tests.js


### Example

	var browserName = "firefox";
	var url = "http://localhost:/4444/wd/hub"; 

	var session = new Session({url: url});
	var capabilities = session.startSession({browserName: browserName});
	var url = "http://www.google.com/";

	return when(capabilities,function(capabilities){
		assert.equal(capabilities.browserName, browserName);

		return when(session.get(url), function(){
			return when(session.getCurrentUrl(), function(currentUrl){
				session.quit();
			});
		});
	});


### API

The api is based on http://code.google.com/p/selenium/wiki/JsonWireProtocol . Note this document may not be 100% current/accurate, so some variations from this document may exist.

The WebDrive API is a synchronous API for most clients.  However, this implementation is ASYNC from the perspective of the driver.  All commands result in Promise returns which can be used like above.

#### Session

* get(url) - Instruct browser to navigate to provided url
* executeScript(script, args) - Execute script in browser with the provided array of arguments
* setImplicitWait(milliseconds) - Wait for up to this amount of time for elements to become available findElement[s] 
* findElement(query) - Perform query for nodes on in the Session's browser.  Returns the first located WebElement if more than one.
* findElements(query) - Perform query for nodes in the browser.  Return array of matching WebElements
* getActiveElement() - Returns the active/focused WebElement 
* getCapabilities() - Returns the webdriver's capabilities for the current session
* getCurrentUrl() - Get the url for the current browser window
* getScreenshot(type) - Take a screenshot of the browser.  Type is one of "BASE64", "", "" and this data is returned.
* getPageSource() - Return the page source;
* getTitle() - Return the Page title
* getCookies() - Return the cookies available to the current page.
* getSpeed() - Return the Input device speed set for this session.
* setSpeed() - Set the input device speed for the session
* getWindowHandle() - Return a handle to the currently focused window.
* getWindowHandles() - Return array of all windows for the current session.
* getOrientation() - Return the browsers orientation.
* isJavascriptEnabled() - Return boolean indicating whether or not javascript is enabled for the session
* navigation.back(), navigation.forward(), navigation.refresh() - Go forward or backward in browser history (if possible) or refresh the page 
* quit() - Shutdown the browser session
* close() - Close the windows associated with the session, but leave teh session itself open.
* deleteCookie(name) - Delete the cookie identified by name;
* deleteAllCookies() - Delete all cookies for the browser session
* switchToFrame(id) - Move focus to a different browser frame by providing it a name, id, or frame index
* switchToWindow(name) - Switch focus to a different browser window by name or handle.

#### WebElement

* findElement(query) - Perform query within this WebElement and return first matching item/WebElement
* findElements(query) - Perform query within this WebElement and return array of matching WebELements
* click() - Mouse click on this WebElement
* submit() - Do submit of form this webelement (if it is a form) or the form this webelement is contained in
* getInnterText() - get the innerText of this node
* getValue - get the value of this node
* getTagName - get the Tag Nam of this node
* clear - Clear the contents of this node if it is a textare or input element
* selected(set) - If no params are provided, check to see if this item is selected. If set is true, select the element
* toggle() - Toggle the state of a checkbox
* enabled() - Checks wehther this element is enabled or not
* getAttribute(name) - Get the attribute 'name' from this web element
* equals(otherElementId) - return boolean indicating this element is the same as the provided elementId
* displayed() - Return boolean indicating this element is displayed or not
* location() - Returns the X,Y coords of this element within the browser
* size - Returns teh width, height of this element
* style(prop) - return the css value of prop for this element
* hover() - Hover the mouse over this elmenent (not currently available on all platforms/browsers)
* drag(x,y) - Drag this element by X,Y px

#### By

The queries for fetchElements are created by the helper functions in require('utils').By and represent the combination of type of search and the query:

	session.findElements(by.id("idOfSomeElement"));

The by functions are:

* className - searches for elements with this class
* cssSelector/query - Does a selector based sear	session.findElements(by.id("idOfSomeElement"));

The by functions are:

* By.className - searches for elements with this class
* By.cssSelector/query - Does a selector based search
* By.id - search by id
* By.linkText - Search for links matching this exact text (case sensitive)
* By.name - Search for elements with this name
* By.partialTextLink - Search for links containing ch
* By.id - search by id
* By.linkText - Search for links containing this exact text (case sensitive)
* By.name - Search for elements with this name
* By.partialTextLink - Search for links containing this text
* By.tagName = Search by tagname
* By.xpath - Search with given xpath query

