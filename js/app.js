"use strict";

var app = angular.module('speedReadingApp', ['ui-rangeSlider']);

app.controller('MainCtrl', function($scope, $timeout, $window, $http) {

	$scope.settings = {
		'wpm' : 300,
		'wpm_ms' : function() {
			return 60000 / $scope.settings.wpm;
		},
		'pause_between_paragraphs' : true,
		'pause_between_sentences' : true,
		'night_mode' : true,
		'text' : '',
		'highlight_focus_point' : true,
		'toastDefault' : '',
		'toast' : ''
	};
	$scope.settings.toast = $scope.settings.toastDefault;

	$scope.game = {
		'words' : [],
		'currentWord' : 0,
		'paused' : false,
		'has_started' : false,
		'percentComplete' : function(round) {
			var perc = ($scope.game.currentWord / $scope.game.words.length) * 100,
				ret = round ? perc.toFixed(1) : perc;

			return ret;
		}
	};

	$scope.modelsToAutoSave = [
		'settings.wpm',
		'settings.pause_between_sentences',
		'settings.night_mode',
		'settings.text',
		'settings.highlight_focus_point',

		'game.currentWord',
		'game.paused',
		'game.has_started'
	];


	// We merged these two settings, but let's keep them under the hood for now
	// This makes sure the values stay the same
	$scope.$watch('settings.pause_between_sentences', function() {
		$scope.settings.pause_between_paragraphs = $scope.settings.pause_between_sentences;
	});


	// Tried to put this in ng-mousedown, but no luck
	angular.element('#timeline').on('mousedown', function() {
		$scope.pauseRead();
	});

	// Pause on space
	angular.element(document).on('keyup', function(e) {
		if(e.which === 32) {
			$scope.togglePause();
		}
	});


	// Handles auto saving of models
	$scope.autoSave = {

		// Runs on page load. Will restore saved values.
		loadAll : function() {
			if(!localStorage.spread) return false;

			var stored = JSON.parse(localStorage.spread);

			for(var model in stored) {
				var modelValue = stored[model];

				// For checkboxes
				if(modelValue === 'on') {
					modelValue = true;
				}
				if(modelValue === 'off') {
					modelValue = false;
				}

				// Make numbers actual numbers
				if(modelValue == parseInt(modelValue)) {
					modelValue = parseInt(modelValue);
				}

				// Split model name by dot, loop through each level and update
				// the corresponding value in $scope
				model.split('.').reduce(function(result, key, index, array) {
					if(index === array.length-1) {
						result[key] = modelValue;
					}
					return result[key];
				}, $scope);
			}
		},

		// Save key-value pair
		save : function(model, val) {

			// Read local storage
	    	var currStored = localStorage.spread ? JSON.parse(localStorage.spread) : {};

	    	// Set new value
	    	currStored[model] = val;

	    	// Save to local storage
	    	localStorage.spread = JSON.stringify(currStored);
		},

		// Setup watchers for models to autosave
		setup : function() {
			for(var mindex in $scope.modelsToAutoSave) {
				var modelName = $scope.modelsToAutoSave[mindex];

				$scope.$watch(modelName, function(newValue) {
					$scope.autoSave.save(this.exp, newValue);
				});
			}
		}
	};

	$scope.autoSave.loadAll();
	$scope.autoSave.setup();


	/**
	 * Prepares for reading then fires off wordLoop
	 */
	$scope.startRead = function() {
		
		// Bail if already started
		if($scope.game.has_started) {
			return false;
		}

		if($scope.isValidURL($scope.settings.text)) {
			$scope.settings.toast = 'Extracting text from URL...';
			$scope.extractFromUrl($scope.settings.text, function(res) {
				if(res.status === 'success') {
					var text = res.result.betterTrim();
					$scope.settings.text = $scope.makeTextReadable(text);
					$scope.game.words = $scope.splitToWords(text);
					$scope.game.has_started = true;
					$scope.game.paused = false;
					$scope.startCountdown();
					$scope.resetToast();
				} else {
					$scope.flashToast('Error: Could not parse URL');
				}
			});
		} else {
			$scope.game.words = $scope.splitToWords($scope.settings.text);
			if($scope.game.words.length < 1) {
				$scope.flashToast('Please enter something to read');
				return false;
			}
			$scope.game.has_started = true;
			$scope.game.paused = false;
			$scope.startCountdown();
		}
	}

	$scope.startCountdown = function() {
		$timeout.cancel($scope.loopTimeout);
		$scope.loopTimeout = $timeout(function() {
			$scope.wordLoop();
		}, 800);
	}

	$scope.stopRead = function() {

		// Bail if not started
		if(!$scope.game.has_started) {
			return false;
		}

		$scope.game.has_started = false;
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
		if(!$scope.game.has_started || $scope.game.paused) {
			return false;
		}

		$scope.game.paused = true;
	}

	/**
	 * Runs when reading is continued from a paused state
	 */
	$scope.continueRead = function(offset) {

		// Bail if we're not paused or not running
		if(!$scope.game.has_started || !$scope.game.paused) {
			return false;
		}

		if(offset) {
			$scope.goToPosition(offset);
		}

		$scope.game.paused = false;
		$scope.game.has_started = true;
		$scope.startCountdown();
	}

	$scope.goToPosition = function(pos) {
		if(pos == 'last_sentence') {
			pos = $scope.findLastSentence();
		}

		$scope.game.currentWord = pos;
	}

	$scope.togglePause = function() {
		if(!$scope.game.has_started) {
			return false;
		}

		if($scope.game.paused) {
			$scope.continueRead();
		} else {
			$scope.pauseRead();
		}
	}


	$scope.extractFromUrl = function(url, callback) {
		url = url.betterTrim();
		$http.get(window.base_url + 'readability.php?url=' + encodeURIComponent(url)) .success(function(data, status) {
			callback(data);
		}).error(function() {
			callback(false);
		});
	}


	
	$scope.flashToast = function(text) {
		$scope.settings.toast = text;
		$timeout($scope.resetToast, 3*1000);
	}
	$scope.resetToast = function() {
		$scope.settings.toast = $scope.settings.toastDefault;
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

				// Short
				if (w.length <= 4) {
					multiplier = .8;

				// Normal
				} else if (w.length <= 8) {
					multiplier = 1;

				// Long
				} else if(w.length <= 12) {
					multiplier = 1.3;

				// Super long
				} else {
					multiplier = 1.5;
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
						'multiplier': 2,
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
					'multiplier': 3,
					'value': '',
					'raw' : {
						'specialChar' : '(end paragraph)'
					}
				});
			}
		}

		// Remove last whitespace
		if($scope.settings.pause_between_paragraphs) {
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
		if($scope.game.has_started === false || $scope.game.paused === true) {
			return false;
		}

		var word = $scope.game.words[$scope.game.currentWord];

		// If pause is disabled and the type is a pause, skip this word
		if(!$scope.settings.pause_between_sentences && word.type == 'pause') {
			$scope.game.currentWord += 1;
			$scope.wordLoop();
			return;
		}

		// Unless this is the last word, set timeout for next word
		if ($scope.game.currentWord < $scope.game.words.length) {
			var timeout = $scope.settings.wpm_ms() * word.multiplier;

			$timeout(function() {
				// Todo: Clean dis' up
				if($scope.game.has_started === true && $scope.game.paused === false) {
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


	$scope.makeTextReadable = function(text) {
		return text.betterTrim().replace(/(\r\n|\n|\r)+/gm, '\r\n\r\n');
	}


	$scope.isValidURL = function(text) {
		return text.betterTrim().match(/^\bhttps?:\/\/?[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]$/);
	}

});



app.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});


app.directive('toggleDropdown', function($timeout) {
	return {
		link: function(scope, elem, attr) {
			angular.element(elem[0]).on('click', function() {
				var dropdown = angular.element(document.getElementById(attr.toggleDropdown));
				if(dropdown.length > 0) {
					dropdown.toggleClass('open');
				}
			});
		}
	}
});


// Removes all double whitespace. Also trims beginning and end.
String.prototype.betterTrim = function() {
	return this.replace(/\s+(?=\s)/g, '').trim();
};