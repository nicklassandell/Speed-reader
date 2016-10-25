;(function() {

	var $scope = {};

	// As soon as the page has loaded, parse it
	parsePage();

	// If text was found, enable toasts
	if($scope.parseResults) {
		chrome.storage.sync.get('hideToastEverywhere', function(res) {

			injectHTML();
			setupEventListeners();
			estimateParseTime();

			if(!res.hideToastEverywhere) {
				$scope.toastContainer.classList.add('hidden');
			}
			
		})
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

		html += '<div id="sr-hide-toast-dialog" class="sr-dialog-container">';
		html += 	'<div class="sr-dialog-inner">';
		html +=	 		'<p>Hide quick access buttons</p>';
		html +=	 		'<p>';
		html +=	 			'<a href="#" id="sr-hide-toast-everywhere-button" class="sr-dialog-button">All websites</a>';
		html +=	 			' or ';
		html +=	 			'<a href="#" id="sr-hide-toast-justhere-button" class="sr-dialog-button">'+ window.location.hostname +'</a>';
		html +=	 			' or ';
		html +=	 			'<a href="#" class="sr-dialog-close">cancel</a>';
		html +=	 		'</p>';
		html += 	'</div>';
		html += '</div>';

		document.body.insertAdjacentHTML('afterbegin', html);
	}

	function estimateParseTime() {

		chrome.storage.sync.get('wpm', function(res) {
			var timeContainer = document.getElementById('sr-read-time-container'),

				words = $scope.parseResults.textContent.split(/\s+/g),
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

	function setupEventListeners() {
		$scope.toastContainer = document.getElementById('sr-toast-container');

		$scope.readBtn = document.getElementById('sr-toast-trigger-read');
		$scope.editBtn = document.getElementById('sr-toast-trigger-edit');
		$scope.hideToastDialogOpener = document.getElementById('sr-toast-trigger-hide');

		$scope.hideToastEverywhereBtn = document.getElementById('sr-hide-toast-everywhere-button');
		$scope.hideToastJusthereBtn = document.getElementById('sr-hide-toast-justhere-button');

		$scope.dialogs = document.querySelectorAll('.sr-dialog-container');
		$scope.dialogCloseTriggers = document.querySelectorAll('.sr-dialog-close');

		$scope.disableToastDialog = document.getElementById('sr-hide-toast-dialog');


		$scope.hideToastEverywhereBtn.onclick = function() {
			chrome.storage.sync.set({ hideToastEverywhere : true });
			$scope.toastContainer.classList.add('hidden');
			hideDialogs();
		}

		$scope.dialogs.forEach(function(d) {
			d.onclick = function(e) {
				if( e.target.classList.contains('sr-dialog-container') ) {
					d.classList.remove('visible');
				}
			}
		});

		$scope.dialogCloseTriggers.forEach(function(t) {
			t.onclick = function(e) {
				hideDialogs();
			}
		});

		function hideDialogs() {
			$scope.dialogs.forEach(function(d) {
				d.classList.remove('visible');
			});
		}

		// Make button visible on load
		setTimeout(function() {
			$scope.readBtn.className += ' visible';
		}, 20);


		// Read page
		$scope.readBtn.onclick = function(e) {
			e.preventDefault();

			// Send parsed text
			chrome.extension.sendMessage({
				action: 'requestRead',
				text: $scope.parseResults.content
			});
		};

		// Request edit
		$scope.editBtn.onclick = function(e) {
			e.preventDefault();

			// Send parsed text
			chrome.extension.sendMessage({
				action: 'requestEdit'
			});
		}

		// Request blacklist
		$scope.hideToastDialogOpener.onclick = function(e) {
			e.preventDefault();

			$scope.disableToastDialog.classList.add('visible');
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
			$scope.parseResults = result;
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

			// $scope.parseResults was created on load
			if(!$scope.parseResults) {
				alert("Can't find any content to read.")
				return false;
			}

			sendResponse($scope.parseResults.content);
		

		} else if(request.action === 'showToastOnPage') {
			$scope.toastContainer.classList.remove('hidden');

		} else if(request.action === 'hideToastOnPage') {
			$scope.toastContainer.classList.add('hidden');
		}
	});

})();