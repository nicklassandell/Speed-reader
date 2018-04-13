var app = angular.module('speedReadingApp', ['rzModule']);

app.controller('MainCtrl', ['$scope', '$timeout', '$interval', '$window', '$http', '$sce', function($scope, $timeout, $interval, $window, $http, $sce) {
	"use strict";

	$scope.settings = {
		'wpm' : 300,
		'wpmMS' : function() {
			return 60000 / $scope.settings.wpm;
		},
		'pauseBetweenParagraphs' : true,
		'pauseBetweenSentences' : true,
		'enableMultiplier' : false, // Vary speed by word length
		'nightMode' : true,
		'text' : '',
		'highlightFocusPoint' : true,
		'centerFocusPoint' : true,
		'toast' : '',
		'useSerifFont' : true,
		'pauseCountdown' : 1,
		'countDownInProgress' : false,
		'showLoadingOverlay' : false,
		'init' : false,
		'windowHeight' : window.innerHeight,
		'windowWidth' : window.innerWidth
	};

	$scope.game = {
		'words' : [],
		'currentWord' : 0,
		'paused' : false,
		'delayedPause' : false, // Same a pause but unpause triggers slightly delayed
		'hasStarted' : false,
		'percentComplete' : function(round) {
			var perc = ($scope.game.currentWord / $scope.game.words.length) * 100,
				ret = round ? perc.toFixed(1) : perc;

			return ret;
		},
		'timeToComplete' : function() {
			var wordsLeft = $scope.game.words.length - $scope.game.currentWord,

				// Time left in minutes
				time = wordsLeft/$scope.settings.wpm,
				roundTime = Math.floor(time);

			// More than a minute left
			if(time >= 1) {
				return '~' + roundTime + ' min';
			}

			// Convert minutes to seconds
			time = Math.round(time*60);
			return '~' + time + ' sec';
		}
	};

	$scope.slider = {
		options: {
			floor: 0,
			ceil: 1,
			showSelectionBar: true,
			hideLimitLabels: true,
			hidePointerLabels: true,
			interval: 200
		}
	};

	// Only for $scope.settings
	$scope.modelsToAutosave = [
		'wpm',
		'pauseBetweenParagraphs',
		'pauseBetweenSentences',
		'enableMultiplier',
		'nightMode',
		'highlightFocusPoint',
		'centerFocusPoint',
		'useSerifFont',
		'windowHeight',
		'windowWidth'
	];



	// Is called at bottom of controller
	$scope.init = function() {

		// Clear all settings
		//chrome.storage.sync.clear();
		$scope.autoSave.loadAll();
		$scope.autoSave.setup();

		chrome.runtime.sendMessage({action: 'getText'}, function(response) {
			$scope.$apply(function() {

				// If editor requested
				if(response.action === 'editBlank') {
					$scope.settings.text = '';
				
				// If read requested
				} else {
					var text = $scope.HtmlToPlainText(response.text);

					$scope.settings.text = text;

					$scope.startRead();
				}

				// Lastly, init app
				$scope.settings.init = true;

			});
		});
	}

	$scope.HtmlToPlainText = function(text) {

		// These tags will count as paragraphs, they get a line break after them
		var newlineTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'hr', 'br', 'table', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'section', 'blockquote'],

			// We don't care if it's an open, close or self-closing tag.
			newlineRegexp = new RegExp('(<\/?(?:'+ newlineTags.join('|') +')\/?>)', 'gim');

		/*
		 * \/? seems pointless in newlineRegexp and to remove HTML below
		 * but it does seem to have an effect so i'll leave it for now
		 * and dig more in it later.
		 */

		// Remove all line breaks
		text = text.replace(/(\r\n|\n|\r)+/gm, '');

		// Add line breaks where appropriate
		text = text.replace(newlineRegexp, '\r\n');

		// Add spacing around all tags
		// When they get removed words might collide otherwise
		text = text.replace(/(<\/?.+?\/?>)/gim, ' $1 ');

		// Remove all remaining HTML
		text = text.replace(/(<\/?.+?\/?>)/gim, '');

		// Trim whitespace everywhere and linebreaks in beginning/end
		text = text.betterTrim();

		// Fix line breaks (all line breaks should be double)
		text = text.replace(/(\r\n|\n|\r)+/gm, '\r\n\r\n');

		// Decode HTML special characters
		text = text.decodeHtml();

		// Trim whitespace everywhere and linebreaks in beginning/end
		// This is run again because sometimes linebreaks are left in the beinning/end
		text = text.betterTrim();

		return text;
	}

	$scope.decodeURI = function(text) {
		var text = decodeURI(text),
			text = text.replaceAll('%0A', "\r\n");

		return text;
	};


	// Handles auto saving of models
	$scope.autoSave = {

		// Runs on page load. Will restore saved values.
		loadAll : function() {
			chrome.storage.sync.get(null, function(options) {

				if(options) {
					for(var opt in options) {

						// Check if option is a settomg
						if( opt in $scope.settings ) {
							$scope.settings[opt] = options[opt];
						}
					}
				}
			});
		},

		// Save key-value pair
		save : function(model, val) {
			var toSave = {};
			toSave[model] = val;

			chrome.storage.sync.set(toSave);
		},

		// Setup watchers for models to autosave
		setup : function() {

			$scope.$watchCollection('settings', function(newObj, oldObj) {
				
				// Loop through new object and compare values to old to see which one changed
				angular.forEach(newObj, function(val, property) {
					if(newObj[property] !== oldObj[property]) {

						// Should we autosave it?
						if( $scope.modelsToAutosave.indexOf(property) !== -1 ) {
							$scope.autoSave.save(property, val);
						}

						// Stop foreach
						return true;
					}
				});

			}, true);
		}
	};


	/**
	 * Prepares for reading then fires off wordLoop
	 */
	$scope.startRead = function() {

		// Bail if already started
		if($scope.game.hasStarted) {
			return false;
		}

		$scope.game.words = $scope.splitToWords($scope.settings.text);

		if($scope.game.words.length < 5) {
			$scope.flashToast('Please enter something to read.');
			return false;
		}

		$scope.game.hasStarted = true;
		$scope.game.paused = false;

		$timeout(function() {
			$scope.startCountdown($scope.settings.pauseCountdown*3);
		}, 50);
	}

	// Todo: Clean this mess up
	$scope.startCountdown = function(steps) {

		var prog = angular.element('#countdown-bar'),
			bar = prog.find('.progress'),

			currStep = 1,

			percentSteps = 100/steps;

		if($scope.settings.countDownInProgress) {
			$interval.cancel($scope.countDownTimeout);
			prog.removeClass('visible');
			bar.attr('style', '');
		}

		$scope.settings.countDownInProgress = true;


		$timeout(function() {
			prog.addClass('visible');
			bar.css('width', percentSteps + '%');

			$scope.countDownTimeout = $interval(function() {
				var percent = percentSteps * (currStep+1);
				bar.css('width', percent + '%');

				if(currStep >= steps) {
					$scope.startWordLoop();
					$interval.cancel($scope.countDownTimeout);

					prog.removeClass('visible');
					bar.attr('style', '');

					$scope.settings.countDownInProgress = false;

					return false;
				}
				currStep += 1;
			}, 1000);
		}, 50);
	}

	$scope.stopRead = function() {
		$scope.game.hasStarted = false;
		$scope.game.paused = false;
		$scope.game.currentWord = 0;

		// Prevent timeout from firing if it's aleady started
		$timeout.cancel($scope.startWordLoopTimeout);
	}

	$scope.restartRead = function() {
		$scope.pauseRead();

		$scope.game.currentWord = 0;
		$scope.game.hasStarted = true;
		$scope.game.paused = false;

		$timeout(function() {
			$scope.startCountdown($scope.settings.pauseCountdown*3);
		}, 50);
	}

	$scope.pauseRead = function() {

		// Bail if not started or already paused
		if(!$scope.game.hasStarted || $scope.game.paused) {
			return false;
		}

		// Prevent timeout from firing if it's aleady started
		$timeout.cancel($scope.startWordLoopTimeout);

		// Reset countdown element
		angular.element('#countdown-bar').removeClass('visible');

		$scope.game.paused = true;
	}

	/**
	 * Runs when reading is continued from a paused state
	 */
	$scope.continueRead = function(offset, showCountdown) {

		// Bail if we're not paused or not running
		if(!$scope.game.hasStarted || !$scope.game.paused) {
			return false;
		}

		if(offset) {
			$scope.goToPosition(offset);
		}

		$scope.game.paused = false;
		$scope.game.hasStarted = true;

		// Todo: Remove showCountdown param, not used
		$timeout.cancel($scope.startWordLoopTimeout);

		$scope.startWordLoopTimeout = $timeout(function() {
			$scope.startWordLoop();
		}, 500);
	}

	$scope.goToPosition = function(pos) {

		if(pos === 'prev_sentence') {
			var goTo = $scope.findPreviousSentence();

		} else if(pos === 'next_sentence') {
			var goTo = $scope.findNextSentence();

		} else if(pos === 'previous') {
			if($scope.game.currentWord > 0) {
				var goTo = $scope.game.currentWord-1;
			}

		} else if(pos === 'next') {
			if($scope.game.currentWord < $scope.game.words.length) {
				var goTo = $scope.game.currentWord+1;
			}
		}

		if(!isNaN(goTo)) {
			$timeout.cancel($scope.startWordLoopTimeout);
			$scope.game.currentWord = goTo;
		}
	}

	$scope.togglePause = function() {
		if(!$scope.game.hasStarted) {
			return false;
		}

		if($scope.game.paused) {
			$scope.continueRead();
		} else {
			$scope.pauseRead();
		}
	}

	$scope.setWPM = function(wpm) {
		wpm = Math.round(wpm / 50) * 50; // Round to nearest 50

		// Min/max checks
		if(wpm < 50 || wpm > 1200) return false;

		$scope.settings.wpm = wpm;
	}


	
	$scope.flashToast = function(text) {
		$scope.settings.toast = text;
		$timeout($scope.resetToast, 3*1000);
	}
	$scope.resetToast = function() {
		$scope.settings.toast = '';
	}


	$scope.findPreviousSentence = function() {
		var currWord = $scope.game.currentWord,
			currWord = currWord > 0 ? currWord-1 : currWord,
			countDown = currWord;

		for(; countDown >= 2; --countDown) {
			var word = $scope.game.words[countDown].value,
				prevWord = $scope.game.words[countDown-1].value,
				secondPrevWord = $scope.game.words[countDown-2].value;

			if( $scope.isBeginningOfSentence(word) && ($scope.isEndOfSentence(prevWord) || $scope.isEndOfSentence(secondPrevWord)) ) {
				return countDown;
			}
		}
		return 0;
	};
	$scope.findNextSentence = function() {
		var currWord = $scope.game.currentWord;

		for(var i = $scope.game.currentWord; i < $scope.game.words.length-2; ++i ) {
			var word = $scope.game.words[i].value,
				nextWord = $scope.game.words[i+1].value,
				secondNextWord = $scope.game.words[i+2].value,

				currIsEnd = $scope.isEndOfSentence(word),
				nextIsBeginning = $scope.isBeginningOfSentence(nextWord),
				secondNextIsBeginning = $scope.isBeginningOfSentence(secondNextWord);

			if( currIsEnd && ( nextIsBeginning || secondNextIsBeginning )) {

				return nextIsBeginning ? i+1 : i+2;
			}
		}
	};

	$scope.isBeginningOfSentence = function(word) {
		// Strip whitespace
		word = word.replace(/\s/, '');

		// Cancel if empty (it's a pause)
		if(word === '') {
			return false;
		}

		// Check if first char is uppercase
		if( word.charAt(0) === word.charAt(0).toUpperCase() ) {
			return true;
		}
		return false;
	}

	$scope.isEndOfSentence = function(word) {
		var lastChar = word.replace(/\s/, '').slice(-1);

		// Check last char
		if( lastChar === '!' || lastChar === '?' || lastChar === '.' ) {
			return true;
		}
		return false;
	}


	/**
	 * Splits chunk of text into array of words, with spaces between
	 * paragraphs if specified.
	 */
	$scope.splitToWords = function(text) {

		// Remove double spaces, tabs, and new lines, this could be improved
		var //text = text.betterTrim().replace(/(\s){2,}/g, '$1'),
			paras = text.match(/(.{1,})/g),
			words = [];

		if(text.length < 1) {
			return [];
		}

		// Loop through all paragraphs
		for(var pi in paras) {
			var para = paras[pi],
				paraWords = para.split(/\s+/g),
				spaceAfterSentence = false;

			// Loop through all words
			for(var wi in paraWords) {
				var w = paraWords[wi],
					lastChar = w.slice(-1),
					multiplier;

				// Set multiplier based on word length
				multiplier = w.length * 0.18;

				// Max
				multiplier = multiplier > 2 ? 2 : multiplier;

				// Min
				multiplier = multiplier < 0.9 ? 0.9 : multiplier;


				var highlighted = $scope.getWordFocusPoint(w);

				// Append word to array
				words.push({
					'type' : 'word',
					'multiplier': multiplier,
					'value': w,
					'raw': highlighted
				});


				// If not last word of paragraph
				// If end of sentence
				if( parseInt(wi)+1 !== paraWords.length && (lastChar === '.' || lastChar === '?' || lastChar === '!') ) {
					words.push({
						'type' : 'pause',
						'multiplier': 1.5,
						'value': ''
					});
				}
			}

			// Add break between each paragraph, except the last one
			if( parseInt(pi)+1 != paras.length ) {
				words.push({
					'type' : 'pause',
					'multiplier': 1.5,
					'value': ''
				});
			}
		}

		return words;
	}

	$scope.getWordFocusPoint = function(word) {
		var breakpoint = .33,
			length = word.length,
			breakAt = Math.floor(length * breakpoint),

			result = {
				start : word.slice(0, breakAt),
				highlighted : word.slice(breakAt, breakAt+1),
				end : word.slice(breakAt+1)
			};

		return result;
	}


	/**
	 * Loop that changes current word. Interval based on specified WPM.
	 */
	$scope.startWordLoop = function() {

		// If reading is paused or not started, don't continue
		if($scope.game.hasStarted === false || $scope.game.paused === true) {
			return false;
		}

		var word = $scope.game.words[$scope.game.currentWord];

		// If pause is disabled and the type is a pause, skip this word
		if(!$scope.settings.pauseBetweenSentences && word.type == 'pause') {
			$scope.game.currentWord += 1;
			$scope.startWordLoop();
			return;
		}

		// Unless this is the last word, set timeout for next word
		if ($scope.game.currentWord < $scope.game.words.length-1) {
			var ms = $scope.settings.wpmMS(),
				multiplier = word.multiplier,
				timeout = ms;

			if($scope.settings.enableMultiplier) {
				var timeout = ms * multiplier;
			}

			$timeout.cancel($scope.startWordLoopTimeout);
			$scope.startWordLoopTimeout = $timeout(function() {
				// Todo: Clean dis' up
				if($scope.game.hasStarted === true && $scope.game.paused === false) {
					$scope.game.currentWord += 1;
					$scope.startWordLoop();
				}
			}, timeout);

		// Last word, let's hold a second before we go back to the settings
		} else {
			$timeout(function() {
				$scope.stopRead();
			}, 500);
		}
	}




	// Start (from editor)
	Mousetrap.bind('ctrl+enter', function() {
		$scope.startRead();
		$scope.$apply();
	});

	// Restart (from reader)
	Mousetrap.bind('r', function() {
		$scope.restartRead();
		$scope.$apply();
	});

	// Toggle pause
	Mousetrap.bind('space', function() {
		$scope.togglePause();
		$scope.$apply();
	});

	// Speed up/down
	Mousetrap.bind(['w', 'up'], function() {
		$scope.setWPM($scope.settings.wpm + 50);
		$scope.$apply();
	});
	Mousetrap.bind(['s', 'down'], function() {
		$scope.setWPM($scope.settings.wpm - 50);
		$scope.$apply();
	});

	// Next/Previous word
	Mousetrap.bind(['left', 'a'], function() {
		$scope.pauseRead();
		$scope.goToPosition('previous');
		$scope.$apply();
	});
	Mousetrap.bind(['right', 'd'], function() {
		$scope.pauseRead();
		$scope.goToPosition('next');
		$scope.$apply();
	});

	// Previous/next sentence
	Mousetrap.bind(['q', 'ctrl+left'], function() {
		$scope.pauseRead();
		$scope.goToPosition('prev_sentence');
		$scope.$apply();
		return false;
	});
	Mousetrap.bind(['next_sentence', 'ctrl+right'], function() {
		$scope.pauseRead();
		$scope.goToPosition('next_sentence');
		$scope.$apply();
		return false;
	});

	// Toggle dark mode
	Mousetrap.bind('c', function() {
		$scope.settings.nightMode = !$scope.settings.nightMode;
		$scope.$apply();
	});



	// We merged these two settings, but let's keep them under the hood for now
	// This makes sure the values stay the same
	$scope.$watch('settings.pauseBetweenSentences', function() {
		$scope.settings.pauseBetweenParagraphs = $scope.settings.pauseBetweenSentences;
	});


	// Force slider update when words list change
	$scope.$watch('game.words', function(words) {
		$scope.slider.options.ceil = words.length;

	    $timeout(function () {
	        $scope.$broadcast('rzSliderForceRender');
	    });
	});


	// Set delayedPause after a delay. This is used for the zoom overview effect.
	$scope.$watch('game.paused', function(paused) {
		if(paused) {
			$scope.game.delayedPause = true;
		} else {
			$timeout.cancel($scope.delayedPauseTimeout);

			$scope.delayedPauseTimeout = $timeout(function() {
				$scope.game.delayedPause = false;
			}, 200);
		}
	});


	// Nightmode switch transition removal. Transitions got messed up anyway.
	$scope.$watch('settings.nightMode', function(n) {
		if($scope.settings.init) {
			document.body.style.setProperty('display', 'none');
			$timeout(function() {
				document.body.style.setProperty('display', 'block');
			}, 20);
		}
	}, true);


	// Pause read when slider is moved manually
	// Can't check for #timeline events because rzslider stops bubbling
	document.body.addEventListener('mousedown', function(e){

		// Check if game has started, otherwise no point in pausing again
		if( $scope.game.hasStarted && !$scope.game.paused ) {

			// Check if we clicked on the slider
			if( angular.element(e.target).closest('#timeline').length > 0 ) {
				$scope.pauseRead();
				$scope.continueOnMouseup = true;

				$scope.$apply();
			}
		}
	}, true);

	// Continue on mouseup after moving slider
	document.body.addEventListener('mouseup', function(e){
		if( $scope.continueOnMouseup ) {

			$scope.continueRead();
			$scope.continueOnMouseup = false;

			$scope.$apply();
		}
	}, true);

	// Save window dimentions on resize
	window.addEventListener('resize', function(e) {
		$timeout.cancel($scope.windowResizeThrottleTimeout);
		$scope.windowResizeThrottleTimeout = $timeout(function() {
			$scope.settings.windowWidth = window.innerWidth;
			$scope.settings.windowHeight = window.innerHeight;
		}, 200);
	});


	// Lastly, run app
	$scope.init();

}]);



app.filter('unsafe', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
}]);


app.directive('toggleDropdown', ['$timeout', function($timeout) {
	return {
		link: function(scope, elem, attr) {
			var closeDropdown = function(e) {
				// If click was NOT inside dropdown
				if(!angular.element(e.target).closest('.dropdown').length > 0) {
					angular.element('.dropdown').removeClass('open');
					angular.element(document).off('click.closeDropdown');
				}
			};

			// Watch for dropdown triggers
			angular.element(elem[0]).on('click', function(e) {
				var dropdown = angular.element(document.getElementById(attr.toggleDropdown)),
					allOpenDropdowns = angular.element('.dropdown.open');

				// If a dropdown is already open, make sure to close it first
				if(allOpenDropdowns.length) {
					closeDropdown(e);
					return false;
				}

				// Attempt to open dropdown
				if(dropdown.length > 0 && !dropdown.is('.open')) {
					dropdown.addClass('open');

					// When you click anywhere outside dropdown, close it
					$timeout(function() {
						angular.element(document).on('click.closeDropdown', closeDropdown);
					}, 0);
				}
			});
		}
	}
}]);



// Removes all double whitespace. Also trims beginning and end. Line breaks are kept intact.
String.prototype.betterTrim = function() {

	var str = this;

	// Remove double spaces
	str = str.replace(/[ \t\f\v]{2,}/gm, ' ');

	// Remove leading and trailing space on each line, keep empty lines
	str = str.replace(/^[ \t\f\v]+|[ \t\f\v]+$/gm, '');

	// Remove whitespace and line breaks in the beginning of the text
	str = str.replace(/^\s+/g, '');

	// Remove whitespace and line breaks in the end of the text
	str = str.replace(/\s+$/g, '');

	return str;
};

// Decodes HTML entities but keeps tags intact
String.prototype.decodeHtml = function() {
	var txt = document.createElement("textarea");
	txt.innerHTML = this;
	return txt.value;
}

String.prototype.replaceAll = function (stringToFind, stringToReplace) {
    if (stringToFind === stringToReplace) return this;
    var temp = this;
    var index = temp.indexOf(stringToFind);
    while (index != -1) {
        temp = temp.replace(stringToFind, stringToReplace);
        index = temp.indexOf(stringToFind);
    }
    return temp;
};