var app = angular.module('speedReadingApp', ['ui-rangeSlider']);

app.controller('MainCtrl', function($scope, $timeout, $window, $http) {

	$scope.settings = {
		'wpm' : 350,
		'wpm_ms' : function() {
			return 60000 / $scope.settings.wpm;
		},
		'pause_between_paragraphs' : true,
		'pause_between_sentences' : true,
		'night_mode' : true,
		'text' : '',
		'left_align_text' : false,
		'sleep' : false,
		'toastDefault' : 'Paste text or URL below',
		'toast' : '',
	};

	$scope.settings.toast = $scope.settings.toastDefault;

	$scope.game = {
		'words' : [],
		'currentWord' : 0,
		'lastSentenceIndex' : 0,
		'paused' : false,
		'has_started' : false,
		'percentComplete' : function(round) {
			var perc = ($scope.game.currentWord / $scope.game.words.length) * 100,
				ret = round ? perc.toFixed(1) : perc;

			return ret;
		}
	};

	// Clean below and move to directive
	var sleepTimer;
	angular.element('body').bind('mousemove', function() {
		$scope.settings.sleep = false;
		$scope.$apply();
		$timeout.cancel(sleepTimer);
		sleepTimer = $timeout(function() {
			$scope.settings.sleep = true;
			$scope.$apply();
		}, 1000);
	});


	// We merged these two settings, but let's keep them under the hood for now
	// This makes sure the values stay the same
	$scope.$watch('settings.pause_between_sentences', function() {
		$scope.settings.pause_between_paragraphs = $scope.settings.pause_between_sentences;
	});


	/**
	 * Loads saved data from localStorage if found
	 */
	$scope.loadFromSessionStorage = function() {
		if(!localStorage.spread) return false;

		var stored = JSON.parse(localStorage.spread);

		for(model in stored) {
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

	}

	$scope.loadFromSessionStorage();


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
				if(res.status == 'success') {
					var text = res.result.betterTrim();
					$scope.settings.text = $scope.makeTextReadable(text);
					$scope.game.words = $scope.splitToWords(text);
					$scope.game.has_started = true;
					$scope.game.paused = false;
					$scope.startCountdown();
					$scope.resetToast();
				}
			});
		} else {
			$scope.game.words = $scope.splitToWords($scope.settings.text);
			$scope.game.has_started = true;
			$scope.game.paused = false;
			$scope.startCountdown();
		}
	}

	$scope.startCountdown = function() {
		$timeout(function() {
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

	$scope.pauseRead = function() {

		// Bail if not started or already paused
		if(!$scope.game.has_started || $scope.game.paused) {
			return false;
		}

		$scope.game.lastSentenceIndex = $scope.findLastSentence();

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

		var startPoint = $scope.game.currentWord;

		if(offset == 'last_sentence') {
			startPoint = $scope.game.lastSentenceIndex;
		}

		$scope.game.currentWord = startPoint-1;
		$scope.game.paused = false;
		$scope.game.has_started = true;
		$scope.wordLoop();
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
		$http.get(window.location.href + 'readability.php?url=' + encodeURIComponent(url)).success(function(data, status) {
			callback(data);
		});
	}


		
	$scope.resetToast = function() {
		$scope.settings.toast = $scope.settings.toastDefault;
	}


	$scope.findLastSentence = function() {
		var possible = false,
			currWord = $scope.game.currentWord,
			countDown = currWord;

		for(; countDown >= 2; --countDown) {

			/*
			if(countDown > limit) {
				console.log('returned');
				return countDown;
			}
			*/

			var word = $scope.game.words[countDown],
				prevWord = $scope.game.words[countDown-1],
				secondPrevWord = $scope.game.words[countDown-2];

			if( $scope.isBeginningOfSentence(word) && ($scope.isEndOfSentence(prevWord) || $scope.isEndOfSentence(secondPrevWord)) ) {
				return countDown;
			}
		}
		return 0;
	};

	$scope.isBeginningOfSentence = function(word) {
		if( word.charAt(0) === word.charAt(0).toUpperCase() ) {
			return true;
		}
		return false;
	}

	$scope.isEndOfSentence = function(word) {
		var lastChar = word.slice(-1);
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

		// Loop through all paragraphs
		for(i in paras) {
			var para = paras[i],
				paraWords = para.split(' '),
				spaceAfterSentence = false;

			// Loop through all words
			for(w in paraWords) {
				var w = paraWords[w],
					lastChar = w.slice(-1);

				// Append word to array
				words.push(w);

				// Append space after word if it's the last word in a
				// sentence, and the setting is on
				spaceAfterSentence = false;
				if($scope.settings.pause_between_sentences) {
					if(lastChar === '.' || lastChar === '?' || lastChar === '!') {
						words.push(' ');
						spaceAfterSentence = true;
					}
				}
			}

			// Add space between each paragraph
			if($scope.settings.pause_between_paragraphs && !spaceAfterSentence) {
				words.push(' ');
			}
		}

		// Remove last whitespace
		if($scope.settings.pause_between_paragraphs) {
			words.pop();
		}
		
		return words;
	}


	/**
	 * Loop that changes current word. Interval based on specified WPM.
	 */
	$scope.wordLoop = function() {

		// If reading is paused or not started, don't continue
		if($scope.game.has_started === false || $scope.game.paused === true) {
			return false;
		}

		// Unless this is the last word, set timeout for next word
		if ($scope.game.currentWord < $scope.game.words.length) {

			// Show next word and set timeout
			$scope.game.currentWord += 1;
			$timeout($scope.wordLoop, $scope.settings.wpm_ms());

		// Last word, let's hold a second before we go back to the settings
		} else {
			$timeout(function() {
				$scope.stopRead();
			}, 1000);
		}
	}


	$scope.makeTextReadable = function(text) {
		return text.betterTrim().replace(/(\r\n|\n|\r)+/gm, '\r\n\r\n'); //.replace(/[\r\n]+/gm, '\r\n\r\n');
	}


	$scope.isValidURL = function(text) {
		return text.betterTrim().match(/^http(s?):\/\/[a-z\/-_.]+$/i);
	}

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


/**
 * Directive to automatically save form field in localStorage.
 * The data saved in localStorage will be automatically set on load.
 */
app.directive('saveOnChange', function() {

	// Check support for localStorage before we attempt to save anything
	if(typeof window.localStorage !== void(0)) {
	    return {
	        require: 'ngModel',
	        link: function(scope, elem) {
	        	var elem = angular.element(elem[0]);

	        	// If the element is not bound to a model, do nothing
	        	if(!elem.attr('ng-model')) {
	        		return false;
	        	}
	            
	            // Watch for change and keyup events
	            elem.on('change keyup', function() {
	            	var elem = angular.element(this),
	            		model = elem.attr('ng-model'),
	            		currStored = localStorage.spread ? JSON.parse(localStorage.spread) : {};

	            	// Checkboxes need some special treatment
	            	if(elem[0].tagName === 'INPUT' && elem[0].type === 'checkbox') {
	            		var val = elem[0].checked ? true : false;
	            	} else {
	            		var val = elem.val();
	            	}

	            	currStored[model] = val;
	            	localStorage.spread = JSON.stringify(currStored);
	            });
	        }
	    };

	// No localStorage support, do nothing
	} else {
		return {};
	}


});

String.prototype.betterTrim = function() {
	return this.replace(/\s+(?=\s)/g, '').trim();
};