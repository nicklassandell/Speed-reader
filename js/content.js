;(function() {

	var parseResults;

	// As soon as the page has loaded, parse it
	parsePage();

	// If text was found, enable toasts
	if(parseResults) {
		injectHTML();
		setupEventListeners();
	}


	function injectHTML() {
		var html = '';

		html += '<div id="sr-toast-container" class="sr-toast-container">';
		html += 	'<a title="Read with Champ" id="sr-toast-trigger-read" class="sr-toast-button">';
		html +=			'<span class="sr-label">Read page with Champ</span>';
		html +=	 		'<span class="sr-icon sr-icon-book"></span>';
		html +=		'</a>';
		html += 	'<a title="Hide" id="sr-toast-trigger-hide" class="sr-toast-button">';
		html +=			'<span class="sr-label">Hide button on this site</span>';
		html +=	 		'<span class="sr-icon sr-icon-close"></span>';
		html += 	'</a>';
		html += '</div>';

		document.body.insertAdjacentHTML('afterbegin', html);
	}

	function setupEventListeners() {
		var toastContainer = document.getElementById('sr-toast-container'),
			readBtn = document.getElementById('sr-toast-trigger-read'),
			hideToastBtn = document.getElementById('sr-toast-trigger-hide');

		// Make button visible on load
		setTimeout(function() {
			readBtn.className += ' visible';
		}, 20);

		readBtn.onclick = function(e) {
			e.preventDefault();

			// Send parsed text
			chrome.extension.sendMessage({
				action: 'requestRead',
				text: parseResults
			});
		};

		hideToastBtn.onclick = function(e) {
			e.preventDefault();

			chrome.extension.sendMessage({
				action: 'blacklist',
				url: window.location.href
			});

			toastContainer.remove();
		}
	}


	function parsePage() {
		var doc = window.document.cloneNode(true),
			loc = document.location,
			uri = {
			  spec: loc.href,
			  host: loc.host,
			  prePath: loc.protocol + "//" + loc.host,
			  scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
			  pathBase: loc.protocol + "//" + loc.host + loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1)
			},
			result;

		result =  new Readability(uri, doc).parse();
		parseResults = result.content;
		
		return result.content;
	}


	// Communication with background script
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

		// To prevent double injection of contentscript
		if(request.action === 'ping') {
			sendResponse({
				message: true
			});

		// When text is requested
		} else if(request.action === 'getParseData') {

			// parseResults was created on load
			if(!parseResults) {
				alert("Can't find any content to read.")
				return false;
			}

			sendResponse(parseResults.content);
		}
	});

})();