// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

/*
$('.right-side').on('click', function() {
	$('body').toggleClass('settings-collapsed');
});
*/



var app = angular.module('dreadApp', []);

app.controller('MainCtrl', function($scope, $timeout) {

	$scope.settings = {
		'wpm' : 350,
		'include_paragraphs' : true,
		'night_mode' : true,
		'text' : $('[ng-model="settings.text"]').val()
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
		$('body').removeClass('paused');

		$scope.toggleSettings(false);

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
			console.log('paused, aborting');
			return false;
		}

		$scope.game.currentWord += 1;

		var percentComplete = $scope.game.percentComplete();
		$('.timeline .marker').css('width', percentComplete + '%');

		if ($scope.game.currentWord < $scope.game.words.length) {
			$timeout($scope.nextWord, $scope.WpmToMs());
		} else {
			$timeout(function() {
				$scope.toggleSettings(true);
				$scope.game.currentWord = 0;
				$('.timeline .marker').css('width', 0);
			}, 1000);
		}
	}

	$scope.WpmToMs = function() {
		return 60000 / $scope.settings.wpm;
	}


	$scope.toggleNightMode = function() {
		if($scope.settings.night_mode) {
			$('body').removeClass('bright_mode');
		} else {
			$('body').addClass('bright_mode');
		}
	}

	$scope.pauseRead = function() {
		$scope.game.paused = true;
		$('body').addClass('paused');
	}

	$scope.continueRead = function(offset) {
		if(!$scope.game.paused) {
			return false;
		}
		var startPoint = $scope.game.currentWord - (offset || 0),
			startPoint = startPoint < 0 ? 0 : startPoint;

		$scope.game.currentWord = startPoint;

		$scope.game.paused = false;
		$('body').removeClass('paused');

		$scope.nextWord();
	}

	$scope.toggleSettings = function(showSettings) {

		if(typeof showSettings === 'undefined') {
			$('body').toggleClass('settings-collapsed');
		} else if (showSettings == false) {
			$('body').addClass('settings-collapsed');
		} else {
			$('body').removeClass('settings-collapsed');
		}
	}

});