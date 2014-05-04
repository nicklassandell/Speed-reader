// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

var app = angular.module('dreadApp', []);

app.controller('MainCtrl', function($scope, $timeout) {

	$scope.settings = {
		'wpm' : 350,
		'wpm_ms' : function() {
			return 60000 / $scope.settings.wpm;
		},
		'include_paragraphs' : true,
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



	$scope.start = function() {
		$scope.game.words = $scope.splitToWords($scope.settings.text);

		$scope.game.paused = false;

		$scope.settings.settings_collapsed = true;

		$timeout(function() {
			$scope.nextWord();
		}, 1000);

	}

	$scope.splitToWords = function(text) {
		var text = $.trim(text).replace(/ +(?= )/g, '').replace("\n\n", "\n"),
			paras = text.split(/[\n]/),
			words = [];


		for(i in paras) {
			var para = paras[i];
			words.push.apply(words, para.split(' ') );

			// Add space between each paragraph
			if($scope.settings.include_paragraphs) {
				words.push(' ');
			}
		}

		// Remove last whitespace
		if($scope.settings.include_paragraphs) {
			words.pop();
		}
		
		return words;
	}

	$scope.nextWord = function() {
		if($scope.game.paused === true) {
			return false;
		}

		$scope.game.currentWord += 1;

		if ($scope.game.currentWord < $scope.game.words.length) {
			$timeout($scope.nextWord, $scope.settings.wpm_ms());
		} else {
			$timeout(function() {
				$scope.settings.settings_collapsed = false;
				$scope.game.currentWord = 0;
			}, 1000);
		}
	}

	$scope.continueRead = function(offset) {
		if(!$scope.game.paused) {
			return false;
		}
		var startPoint = $scope.game.currentWord - (offset || 0),
			startPoint = startPoint < 0 ? 0 : startPoint;

		$scope.game.currentWord = startPoint;

		$scope.game.paused = false;

		$scope.nextWord();
	}

});