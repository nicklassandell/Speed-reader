;(function() {

	var showToasts = document.getElementById('enableToast'),
		hideToasts = document.getElementById('disableToast');

	showToasts.onclick = function() {
		chrome.storage.sync.set({ hideToastEverywhere : false });

		messageCurrentTab({
			action: 'showToastOnPage'
		});
	}
	hideToasts.onclick = function() {
		chrome.storage.sync.set({ hideToastEverywhere : true });

		messageCurrentTab({
			action: 'hideToastOnPage'
		});
	}

	function messageCurrentTab(message, callback) {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, message, callback);
		});
	}

})();