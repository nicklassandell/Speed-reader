;(function() {

	var html = '';

	html += '<div id="sr-toast-container" class="sr-toast-container">';
	html += 	'<a title="Read with Champ" id="sr-toast-trigger-read" class="sr-toast-button">';
	html +=			'<span class="sr-label">Read page with Champ</span>';
	html +=	 		'<div class="sr-icon"><object type="image/svg+xml" data="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKIHdpZHRoPSI1MTIuMDAwMDAwcHQiIGhlaWdodD0iNTEyLjAwMDAwMHB0IiB2aWV3Qm94PSIwIDAgNTEyLjAwMDAwMCA1MTIuMDAwMDAwIgogcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCI+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLDUxMi4wMDAwMDApIHNjYWxlKDAuMTAwMDAwLC0wLjEwMDAwMCkiCmZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSI+CjxwYXRoIGQ9Ik0xNDAgNDM1MCBjMCAtMTkzIDAgLTI1MTEgMCAtMjc5OCAwIC0yMDMgMyAtMjgxIDExIC0yNzYgMjggMTcgNTU1CjMgNzg5IC0yMiAyNSAtMiA3MCAtNiAxMDAgLTkgNTMgLTUgMjYwIC0zMSAzMTAgLTM5IDE0IC0zIDU5IC05IDEwMCAtMTYgNDEKLTYgOTUgLTE1IDEyMCAtMjAgMjUgLTYgNTkgLTEyIDc3IC0xNSAxOCAtMyA2MyAtMTIgMTAwIC0yMCAzNyAtOSA3OSAtMTggOTMKLTIwIDE0IC0zIDM2IC04IDUwIC0xMSAxNCAtMyAzMiAtNyA0MCAtOSA1MSAtMTAgMzM1IC05MSA0NDMgLTEyNSA3MSAtMjMgMTMxCi0zOSAxMzMgLTM3IDQgNCA2IDIwMjMgNCAzMDM5IGwwIDEyNyAtNDcgMjEgYy0xNDggNjYgLTU4NyAxOTMgLTc0MyAyMTUgLTI0CjQgLTQ3IDggLTUwIDEwIC0zIDIgLTI2IDYgLTUwIDEwIC0yNSAzIC04NSAxMiAtMTM1IDIwIC00OSA3IC0xMTcgMTYgLTE1MCAyMAotMzMgMyAtNzMgOCAtOTAgMTAgLTE2IDIgLTU5IDYgLTk1IDkgLTM2IDMgLTk2IDkgLTEzNSAxMiAtMzggNCAtOTcgOCAtMTMwIDkKLTE3MSA4IC00NjcgMTcgLTU5NyAxOSBsLTE0OCAyIDAgLTEwNnoiLz4KPHBhdGggZD0iTTQ3MzcgNDQ1NCBjLTEgLTEgLTEwNSAtNSAtMjMyIC04IC0yMjggLTcgLTI3MSAtOSAtNDM1IC0yMSAtODkgLTcKLTkyIC03IC0yNjAgLTI2IC01OCAtNiAtMTE0IC0xMiAtMTI1IC0xMyAtMjggLTMgLTEyNiAtMTggLTE1MCAtMjIgLTExIC0zCi0zNiAtNyAtNTUgLTEwIC0yOCAtNCAtMTk1IC0zNyAtMjk1IC01OSAtMTEgLTIgLTU2IC0xNCAtMTAwIC0yNSAtNDQgLTEyIC04NAotMjMgLTkwIC0yNCAtMjQgLTUgLTI5NSAtOTggLTM0MiAtMTE4IC0xNSAtNiAtMzAgLTEyIC0zMyAtMTIgLTM3IC04IC0zNSA0NwotMzUgLTE2MDQgMCAtMTA0OCAzIC0xNTgyIDEwIC0xNTgyIDYgMCA0NCAxMiA4NSAyNSA2OSAyNCAzNzUgMTEzIDQxMSAxMjAgOAoyIDQ0IDEwIDgwIDE5IDc2IDE5IDgxIDIwIDI1NCA1NiAxMDYgMjIgMzc1IDY1IDQ3MCA3NiAzMyAzIDY4IDggNzggMTAgMTAgMgo0NiA2IDgwIDkgMzQgMyA4MiA4IDEwNyAxMCAxNTQgMTcgNDAzIDI3IDYyMSAyNiBsMTc2IDAgLTEgMTU4NyAtMSAxNTg3IC0xMDgKMCBjLTYwIDAgLTEwOSAtMSAtMTEwIC0xeiIvPgo8cGF0aCBkPSJNNDM5IDEwNDggYy0xIC02NyAwIC0xMzQgMSAtMTQ4IDMgLTQ1IDMwIC04NiA2OCAtMTA2IDM2IC0xOCA3MiAtMTkKMTAwNyAtMjEgODI1IC0xIDk2MyAxIDkyNSAxMiAtMTk1IDU4IC00NzAgMTMyIC02NDAgMTcxIC01OCAxNCAtMTE0IDI3IC0xMjUKMzAgLTExIDIgLTMzIDcgLTUwIDEwIC0xNiAzIC01OSAxMSAtOTUgMTkgLTM2IDggLTc3IDE3IC05MyAxOSAtMTUgMyAtMzUgNwotNDUgMTAgLTE3IDUgLTI3NyA1MCAtMzU3IDYyIC0yMiAzIC01MSA3IC02NSA5IC0xNCAyIC00NyA3IC03NSAxMCAtMjcgNCAtNjEKOCAtNzUgMTAgLTE0IDIgLTUwIDYgLTgwIDEwIC01NiA2IC04NyA5IC0yMjIgMjAgbC03OCA3IC0xIC0xMjR6Ii8+CjxwYXRoIGQ9Ik00NTY3IDExNjQgYy0xIC0xIC00MiAtNSAtOTIgLTkgLTQ5IC0zIC0xMDMgLTggLTEyMCAtMTEgLTE2IC0yIC01MwotNiAtODAgLTkgLTI4IC0zIC02NiAtOCAtODUgLTExIC0xOSAtMiAtNTEgLTcgLTcwIC0xMCAtMTA5IC0xNSAtMzAxIC00OAotNDM4IC03NSAtODYgLTE4IC0xNjYgLTMzIC0xNzcgLTM1IC0xMSAtMSAtMjAgLTMgLTIwIC00IDAgLTIgLTEzIC01IC01NSAtMTMKLTY0IC0xMyAtNDUwIC0xMTAgLTU4MCAtMTQ2IC0yNzUgLTc3IC0zNDcgLTcwIDcyNSAtNzAgbDk2MCAwIDUxIDI1IGM2NSAzMwo3MSA1MCA3MiAyMzIgbDEgMTQxIC00NSAtMiBjLTI1IC0xIC00NiAtMiAtNDcgLTN6Ii8+CjwvZz4KPC9zdmc+"></object></div>';
	html +=		'</a>';
	html += 	'<a title="Hide" id="sr-toast-trigger-hide" class="sr-toast-button">';
	html +=			'<span class="sr-label">Hide button on this site</span>';
	html +=	 		'<div class="sr-icon"><object type="image/svg+xml" data="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMyIDMyIiBoZWlnaHQ9IjMycHgiIGlkPSLQodC70L7QuV8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik0xNy40NTksMTYuMDE0bDguMjM5LTguMTk0YzAuMzk1LTAuMzkxLDAuMzk1LTEuMDI0LDAtMS40MTRjLTAuMzk0LTAuMzkxLTEuMDM0LTAuMzkxLTEuNDI4LDAgIGwtOC4yMzIsOC4xODdMNy43Myw2LjI4NGMtMC4zOTQtMC4zOTUtMS4wMzQtMC4zOTUtMS40MjgsMGMtMC4zOTQsMC4zOTYtMC4zOTQsMS4wMzcsMCwxLjQzMmw4LjMwMiw4LjMwM2wtOC4zMzIsOC4yODYgIGMtMC4zOTQsMC4zOTEtMC4zOTQsMS4wMjQsMCwxLjQxNGMwLjM5NCwwLjM5MSwxLjAzNCwwLjM5MSwxLjQyOCwwbDguMzI1LTguMjc5bDguMjc1LDguMjc2YzAuMzk0LDAuMzk1LDEuMDM0LDAuMzk1LDEuNDI4LDAgIGMwLjM5NC0wLjM5NiwwLjM5NC0xLjAzNywwLTEuNDMyTDE3LjQ1OSwxNi4wMTR6IiBmaWxsPSIjMTIxMzEzIiBpZD0iQ2xvc2UiLz48Zy8+PGcvPjxnLz48Zy8+PGcvPjxnLz48L3N2Zz4="></object></div>';
	html += 	'</a>';
	html += '</div>';

	document.body.insertBefore(createFragment(html), document.body.childNodes[0]);


	var toastBtn = document.getElementById('sr-toast-trigger-read'),
		hideToastBtn = document.getElementById('sr-toast-trigger-hide'),
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