
// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
// $(document).foundation();


var app = angular.module('speedReadingApp', []);

app.controller('MainCtrl', function($scope, $timeout) {

	$scope.settings = {
		'wpm' : 350,
		'wpm_ms' : function() {
			return 60000 / $scope.settings.wpm;
		},
		'pause_between_paragraphs' : true,
		'pause_between_sentences' : true,
		'night_mode' : true,
		'text' : $('[ng-model="settings.text"]').val(),
		'settings_collapsed' : false
	};

	$scope.game = {
		'words' : [],
		'currentWord' : 0,
		'paused' : false,
		'percentComplete' : function(round) {
			var perc = ($scope.game.currentWord / $scope.game.words.length) * 100,
				ret = round ? perc.toFixed(1) : perc;

			return ret;
		}
	};


	/**
	 * Prepares for reading then fires off wordLoop
	 */
	$scope.startRead = function() {
		$scope.game.words = $scope.splitToWords($scope.settings.text);
		$scope.game.paused = false;
		$scope.settings.settings_collapsed = true;

		// Hold a second before we star the read
		$timeout(function() {
			$scope.wordLoop();
		}, 800);
	}


	/**
	 * Splits chunk of text into array of words, with spaces between
	 * paragraphs if specified.
	 */
	$scope.splitToWords = function(text) {

		// Remove double spaces, tabs, and new lines, this could be improved
		var text = $.trim(text).replace(/(\s){2,}/g, '$1'),
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

		// If reading is paused, don't continue
		if($scope.game.paused === true) {
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
				$scope.settings.settings_collapsed = false;
				$scope.game.currentWord = 0;
			}, 1000);
		}
	}

	/**
	 * Runs when reading is continued from a paused state
	 */
	$scope.continueRead = function(offset) {

		// Bail if we're not paused
		if(!$scope.game.paused) {
			return false;
		}

		// Calculate new starting point based on offset
		var startPoint = $scope.game.currentWord - (offset || 0),
			startPoint = startPoint < 0 ? 0 : startPoint;

		$scope.game.currentWord = startPoint;
		$scope.game.paused = false;
		$scope.wordLoop();
	}

});