;(function() {

	var html = '';

	html += '<div id="sr-toast-container" class="sr-toolbar">';
	html += 	'<a title="Read with Champ" id="sr-toast" class="sr-toast-button">';
	html +=	 		'<img src="'+ chrome.extension.getURL('img/read.png') +'" alt="Read with Champ" />';
	html +=		'</a>';
	html += 	'<a title="Hide" id="sr-toast-hide" class="sr-toast-button">';
	html +=	 		'<img src="'+ chrome.extension.getURL('img/hide.png') +'" alt="Read with Champ" />';
	html += 	'</a>';
	html += '</div>';

	document.body.insertBefore(createFragment(html), document.body.childNodes[0]);


	var toastBtn = document.getElementById('sr-toast'),
		hideToastBtn = document.getElementById('sr-toast-hide'),
		toastContainer = document.getElementById('sr-toast-container');

	// Make button visible on load
	setTimeout(function() {
		toastBtn.className += ' visible';
	}, 20);


	toastBtn.onclick = function(e) {
		e.preventDefault();
		chrome.extension.sendMessage({
			action: 'openUrl',
			url: window.location.href
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

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if(request.action === 'ping') {
			sendResponse({
				message: true
			});
		} else if(request.action === 'getParseData') {
			var parsed = parsePage();

			if(!parsed) {
				alert("Can't find any content to read.")
				return false;
			}

			sendResponse(parsed.content);
		}
	});


	function createFragment(htmlStr) {
	    var frag = document.createDocumentFragment(),
	        temp = document.createElement('div');
	    temp.innerHTML = htmlStr;
	    while (temp.firstChild) {
	        frag.appendChild(temp.firstChild);
	    }
	    return frag;
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
			article;

		article = new Readability(uri, doc).parse();
		return article;
	}
})();