;(function() {

	var parseResults;

	// As soon as the page has loaded, parse it
	parsePage();

	// If text was found, enable toasts
	if(parseResults) {
		injectHTML();
		setupEventListeners();
		estimateParseTime();
	}

	function estimateParseTime() {

		chrome.storage.sync.get('wpm', function(res) {
			var timeContainer = document.getElementById('sr-read-time-container'),

				words = parseResults.textContent.split(/\s+/g),
				wordCount = words.length,
				wpmOpt = res.wpm,

				wpm = (wordCount/wpmOpt) * 1.2, // Add 20% words, magic number to be more correct
				wpmRound = Math.floor(wpm),
				text = '';

			if(wpmRound < 1) {
				text = '<1';
			} else {
				text = wpmRound;
			}

			timeContainer.innerHTML = text;
		});
	}


	function injectHTML() {
		var html = '';

		html += '<div id="sr-toast-container" class="sr-toast-container">';
		html += 	'<a title="Read with Champ" id="sr-toast-trigger-read" class="sr-toast-button sr-toast-btn-read">';
		html +=			'<span class="sr-label">Read page with Champ</span>';
		html +=	 		'<span id="sr-read-time-container" class="sr-icon sr-icon-book"></span>';
		html +=		'</a>';
		html += 	'<a title="Edit" id="sr-toast-trigger-edit" class="sr-toast-button">';
		html +=			'<span class="sr-label">Open editor to paste text</span>';
		html +=	 		'<span class="sr-icon sr-icon-edit"></span>';
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
			editBtn = document.getElementById('sr-toast-trigger-edit'),
			hideToastBtn = document.getElementById('sr-toast-trigger-hide');

		// Make button visible on load
		setTimeout(function() {
			readBtn.className += ' visible';
		}, 20);


		// Read page
		readBtn.onclick = function(e) {
			e.preventDefault();

			// Send parsed text
			chrome.extension.sendMessage({
				action: 'requestRead',
				text: parseResults.content
			});
		};

		// Request edit
		editBtn.onclick = function(e) {
			e.preventDefault();

			// Send parsed text
			chrome.extension.sendMessage({
				action: 'requestEdit'
			});
		}

		// Request blacklist
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

		if(result) {
			parseResults = result;
			return result;
		}

		return false;
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