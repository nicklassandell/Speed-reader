var app = angular.module('speedReadingApp', ['rzModule']);

app.controller('MainCtrl', ['$scope', '$timeout', '$interval', '$window', '$http', function($scope, $timeout, $interval, $window, $http) {
	"use strict";

	$scope.settings = {
		'wpm' : 300,
		'wpmMS' : function() {
			return 60000 / $scope.settings.wpm;
		},
		'pauseBetweenParagraphs' : true,
		'pauseBetweenSentences' : true,
		'enableMultiplier' : true, // Vary speed by word length
		'nightMode' : true,
		'text' : '',
		'highlightFocusPoint' : true,
		'centerFocusPoint' : true,
		'toast' : '',
		'useSerifFont' : true,
		'pauseCountdown' : 1,
		'countDownInProgress' : false,
		'showLoadingOverlay' : false,
		'init' : false
	};

	$scope.game = {
		'words' : [],
		'currentWord' : 0,
		'paused' : false,
		'hasStarted' : false,
		'percentComplete' : function(round) {
			var perc = ($scope.game.currentWord / $scope.game.words.length) * 100,
				ret = round ? perc.toFixed(1) : perc;

			return ret;
		},
		'timeToComplete' : function() {
			var wordsLeft = $scope.game.words.length - $scope.game.currentWord,
				min = wordsLeft/$scope.settings.wpm,
				round = Math.round(min);

			return min < 1 ? '< 1' : round;
		}
	};

	$scope.slider = {
		options: {
			floor: 0,
			ceil: 1,
			showSelectionBar: true,
			hideLimitLabels: true,
			hidePointerLabels: true,
			interval: 250,
			/*hidePointerLabels: false,
			hideLimitLabels: false,
			showSelectionBarEnd: false,
			showSelectionBarFromValue: false*/
		}
	};

	$scope.$watch('game.words', function(words) {
		$scope.slider.options.ceil = words.length;

	    $timeout(function () {
	        $scope.$broadcast('rzSliderForceRender');
	    });
	});

	// Only for $scope.settings atm
	$scope.autosaveVariables = [
		'settings.wpm',
		'settings.pauseBetweenSentences',
		'settings.enableMultiplier',
		'settings.nightMode',
		'settings.highlightFocusPoint',
		'settings.centerFocusPoint',
		'settings.useSerifFont'
	];



	// Is called at bottom of controller
	$scope.init = function() {

		// Clear all settings
		//chrome.storage.sync.clear();
		$scope.autoSave.loadAll();
		$scope.autoSave.setup();

		chrome.runtime.sendMessage({action: 'getText'}, function(response) {
			$scope.$apply(function() {

				var text = $scope.HtmlToPlainText(response);

				$scope.settings.text = text;

				// Lastly, init app
				$scope.settings.init = true;

				$scope.startRead();
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

						if(opt in $scope.settings) {
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

			// Loop through all models to autosave
			for(var i in $scope.autosaveVariables) {
				var modelName = $scope.autosaveVariables[i];

				// Attach watch event to capture changes
				$scope.$watch(modelName, function(change) {
					var t = modelName;
					t = t.substring( modelName.lastIndexOf('.')+1 );
					$scope.autoSave.save(t, change);
				});
			}
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
		}, 300);
	}

	// Todo: Clean this mess up
	$scope.startCountdown = function(steps) {

		if($scope.settings.countDownInProgress) {
			return false;
		}

		$scope.settings.countDownInProgress = true;

		var prog = angular.element('#countdown-bar'),
			bar = prog.find('.progress'),

			currStep = 1,

			percentSteps = 100/steps;

		prog.addClass('visible');

		$timeout(function() {
			bar.css('width', percentSteps + '%');

			$scope.countDownTimeout = $interval(function() {
				var percent = percentSteps * (currStep+1);
				bar.css('width', percent + '%');

				if(currStep >= steps) {
					$scope.wordLoop();
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
	}

	$scope.restartRead = function() {
		$scope.pauseRead();
		$scope.game.currentWord = 0;
		$scope.continueRead();
	}

	$scope.pauseRead = function() {

		// Bail if not started or already paused
		if(!$scope.game.hasStarted || $scope.game.paused) {
			return false;
		}

		angular.element('#countdown-bar').removeClass('visible');

		$scope.game.paused = true;
	}

	/**
	 * Runs when reading is continued from a paused state
	 */
	$scope.continueRead = function(offset) {

		// Bail if we're not paused or not running
		if(!$scope.game.hasStarted || !$scope.game.paused) {
			return false;
		}

		if(offset) {
			$scope.goToPosition(offset);
		}

		$scope.game.paused = false;
		$scope.game.hasStarted = true;
		$scope.startCountdown($scope.settings.pauseCountdown);
	}

	$scope.goToPosition = function(pos) {
		if(pos === 'last_sentence') {
			var goTo = $scope.findLastSentence();
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
		if(wpm < 50 || wpm > 800) return false;

		$scope.settings.wpm = wpm;
	}


	
	$scope.flashToast = function(text) {
		$scope.settings.toast = text;
		$timeout($scope.resetToast, 3*1000);
	}
	$scope.resetToast = function() {
		$scope.settings.toast = '';
	}


	$scope.findLastSentence = function() {
		var possible = false,
			currWord = $scope.game.currentWord,
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

	$scope.isBeginningOfSentence = function(word) {
		// Strip whitespace
		word = word.betterTrim().replace(/\s/, '');

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
		var lastChar = word.slice(-1);

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
		var text = text.betterTrim().replace(/(\s){2,}/g, '$1'),
			paras = text.split(/[\n]/),
			words = [];

		if(text.length < 1) {
			return [];
		}

		// Loop through all paragraphs
		for(var i in paras) {
			var para = paras[i],
				paraWords = para.split(' '),
				spaceAfterSentence = false;

			// Loop through all words
			for(var wi in paraWords) {
				var w = paraWords[wi],
					lastChar = w.slice(-1),
					multiplier;

				// Super long word
				if(w.length > 18) {
					multiplier = 2;
				
				// Long word
				} else if(w.length > 12) {
					multiplier = 1.5;
				
				// Medium word
				} else if(w.length > 8) {
					multiplier = 1;
				
				// Short word
				} else {
					multiplier = .7;
				}

				var highlighted = $scope.highlightFocusPoint(w);

				// Append word to array
				words.push({
					'type' : 'word',
					'multiplier': multiplier,
					'value': w,
					'raw': highlighted
				});

				// Append space after word if it's the last word in a
				// sentence, and the setting is on
				spaceAfterSentence = false;
				if(lastChar === '.' || lastChar === '?' || lastChar === '!') {
					words.push({
						'type' : 'pause',
						'multiplier': 1.5,
						'value': '',
						'raw' : {
							'specialChar' : '(new line)'
						}
					});
					spaceAfterSentence = true;
				}
			}

			// Add space between each paragraph
			if(!spaceAfterSentence) {
				words.push({
					'type' : 'pause',
					'multiplier': 1.5,
					'value': '',
					'raw' : {
						'specialChar' : '(new paragraph)'
					}
				});
			}
		}

		// Hack, remove last whitespace
		if($scope.settings.pauseBetweenParagraphs) {
			words.pop();
		}
		
		return words;
	}

	$scope.highlightFocusPoint = function(word) {
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
	$scope.wordLoop = function() {

		// If reading is paused or not started, don't continue
		if($scope.game.hasStarted === false || $scope.game.paused === true) {
			return false;
		}

		var word = $scope.game.words[$scope.game.currentWord];

		// If pause is disabled and the type is a pause, skip this word
		if(!$scope.settings.pauseBetweenSentences && word.type == 'pause') {
			$scope.game.currentWord += 1;
			$scope.wordLoop();
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

			$timeout.cancel($scope.wordLoopTimeout);
			$scope.wordLoopTimeout = $timeout(function() {
				// Todo: Clean dis' up
				if($scope.game.hasStarted === true && $scope.game.paused === false) {
					$scope.game.currentWord += 1;
					$scope.wordLoop();
				}
			}, timeout);

		// Last word, let's hold a second before we go back to the settings
		} else {
			$timeout(function() {
				$scope.stopRead();
			}, 500);
		}
	}




$interval.cancel($scope.countDownTimeout);
	// Pause
	Mousetrap.bind('ctrl+enter', function() {
		$scope.startRead();
		$scope.$apply();
	});

	// Pause
	Mousetrap.bind('space', function() {
		$scope.togglePause();
		$scope.$apply();
	});

	// Previous word
	Mousetrap.bind(['left', 'a'], function() {
		$scope.pauseRead();
		$scope.goToPosition('previous');
		$scope.$apply();
	});

	// Next word
	Mousetrap.bind(['right', 'd'], function() {
		$scope.pauseRead();
		$scope.goToPosition('next');
		$scope.$apply();
	});

	// Previous sentence
	Mousetrap.bind(['ctrl+left'], function() {
		$scope.pauseRead();
		$scope.goToPosition('last_sentence');
		$scope.$apply();
	});



	// We merged these two settings, but let's keep them under the hood for now
	// This makes sure the values stay the same
	$scope.$watch('settings.pauseBetweenSentences', function() {
		$scope.settings.pauseBetweenParagraphs = $scope.settings.pauseBetweenSentences;
	});


	// Tried to put this in ng-mousedown, but no luck
	angular.element('#timeline').on('mousedown', function() {
		$scope.pauseRead();
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