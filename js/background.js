
var textToRead = { text: '', action: '' },
	contextMenuAdded = false;

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

		// Show or hide toast for this tab
		getOption('hideToast', function(hideToast) {
			if(!hideToast) {
				chrome.tabs.insertCSS(tabId, {file: 'css/content.css'}, function() {
					chrome.tabs.executeScript(tabId, {file: 'js/libs/readability.js', runAt: 'document_end'});
					chrome.tabs.executeScript(tabId, {file: 'js/content.js', runAt: 'document_end'});
				});
			}
		});
	});

});


chrome.runtime.onInstalled.addListener(function() {

	chrome.tabs.create({
		'url': 'welcome.html'
	});

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
		

		// APP is requested text
		} else if(data.action == 'getText') {
			sendResponse(textToRead);
		

		// DOCUMENT (content script) requested a read start
		} else if(data.action == 'requestRead') {
			textToRead.text = data.text;
			textToRead.action = 'read'
			openApp();
		
		// DOCUMENT (content script) requested a read start
		} else if(data.action == 'requestEdit') {
			textToRead.action = 'editBlank';
			openApp();
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

			chrome.contextMenus.onClicked.addListener(function(info, tab) {

				if(info.menuItemId === 'readSelection') {

					chrome.tabs.executeScript( {
						code: "window.getSelection().toString();"
					}, function(text) {

						// App only accepts HTML, so let's convert plaintext line breaks into <br>
						text = text[0].replace(/(\r\n|\n|\r)+/gm, '<br/>');

						textToRead.text = text;
						textToRead.action = 'read';
						openApp();
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
	chrome.storage.sync.get(['windowHeight', 'windowWidtht'], function(size) {
		var height = size.windowHeight || 550,
			width = size.windowWidth || 1150;

		chrome.windows.create({
			url: 'app.html',
			type: 'popup',
			width: width,
			height: height
		});
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