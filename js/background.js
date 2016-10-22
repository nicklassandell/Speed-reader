
var textToRead = '';


var contextMenuAdded = false;

chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {

	// If not complete or invalid URL
	if (change.status !== 'complete' || !tab.url.match(/^https?:\/\//)) {
		return false;
	}

	updateContextMenu();

	// Try to ping tab to check if script has already been injected
	chrome.tabs.sendMessage(tabId, {action: 'ping'}, function(response) {

		// Already injected, let's bail
		if(response) {
			return false;
		}

		// Check if domain is blacklisted
		//isBlacklisted(tab.url, function(isBlacklisted) {
		//	if(isBlacklisted) {
		//		return false;
		//	}

			// Show or hide toast for this tab
			getOption('hideToast', function(hideToast) {
				if(!hideToast) {
					chrome.tabs.insertCSS(tabId, {file: 'css/content.css'}, function() {
						chrome.tabs.executeScript(tabId, {file: 'js/libs/readability.js'});
						chrome.tabs.executeScript(tabId, {file: 'js/content.js'});
					});
				}
			});
		//});
	});

});

// When the toolbar icon is clicked
chrome.browserAction.onClicked.addListener(function(tab) {
});



// Listen for callbacks from injected code
chrome.extension.onMessage.addListener(function(data, sender, sendResponse) {
	if(typeof data === 'object') {

		// Add domain to blacklist
		if(data.action == 'blacklist') {
			var domain = new URL(data.url).hostname;

			// Get current value and append domain to it
			getOption('toastBlacklist', function(currVal) {
				var newVal = currVal + "\r\n" + domain;
				chrome.storage.sync.set({
					toastBlacklist: newVal
				});
			});
			
		}
		else if(data.action == 'getText') {
			sendResponse(textToRead);
		}
	}
});

// Sometimes they stay in memory after extension reload
// so let's just make sure we remove it completely on load.
chrome.contextMenus.removeAll();

function updateContextMenu() {
	getOption('hideContextMenu', function(hideContextMenu) {

		// Show menu
		if(!hideContextMenu) {

			// If already added, do nothing
			if(contextMenuAdded) {
				return false;
			}

			chrome.contextMenus.create({
				id: 'readSelection',
				title : 'Read selected text with Readio',
				contexts : ['selection']
			});

			chrome.contextMenus.create({
				id: 'readPage',
				title : 'Read page with Readio',
				contexts : ['all']
			});

			chrome.contextMenus.onClicked.addListener(function(info, tab) {

				if(info.menuItemId === 'readSelection') {

					chrome.tabs.executeScript( {
						code: "window.getSelection().toString();"
					}, function(selection) {
						var selected = selection[0];
						textToRead = selected;
						openApp();
					});

				} else if(info.menuItemId === 'readPage') {

					chrome.tabs.sendMessage(tab.id, {action: 'getParseData'}, function(text) {
						if(text) {
							textToRead = text;
							openApp();
						}
					});


				}

			});

			contextMenuAdded = true;

		// Hide menu if added
		} else {
			if(contextMenuAdded) {
				chrome.contextMenus.remove('readSelection');
				chrome.contextMenus.remove('readPage');
			}
			contextMenuAdded = false;
		}
	});
}



function openApp() {
	var width = 1200,
		height = 650/*,
		left = (screen.width/2) - (width/2),
		top = (screen.height/2) - (height/2)*/;

	chrome.windows.create({
		url: 'app.html',
		type: 'popup',
		width: width,
		height: height

		/*, Will center window but can't control which monitor it's displayed on, so skipping for now
		left: left,
		top: top*/
	});
}


function getOption(option, callback) {
	chrome.storage.sync.get(option, function(obj) {
		if(obj[option] !== undefined) {
			callback(obj[option]);
		} else {
			callback();
		}
	});
}

function isBlacklisted(url, callback) {
	var currDom = new URL(url).hostname;
	var stored = getOption('toastBlacklist', function(stored) {

		var split = stored.split(/\r|\n/g);
		
		if(split.length > 0) {
			for(var i=0; i < split.length; ++i) {
				var dom = split[i];
				if(dom.indexOf(currDom) !== -1) {
					callback(true);
					return true; // Prevent loop from continuing
				}
			}
		}
		callback(false);
	});
}