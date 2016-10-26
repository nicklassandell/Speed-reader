var app = angular.module('popupApp', []);

app.controller('MainCtrl', ['$scope', '$timeout', '$interval', '$window', '$http', function($scope, $timeout, $interval, $window, $http) {
	"use strict";

	$scope.init = false;

	$scope.quickAccessGlobal = false;
	$scope.disableQuickAccessJusthere = false;

	$scope.tabId = 0;
	$scope.tabUrl = '';

	$scope.quickAccessBlacklist = [];


	$scope.init = function() {

		//chrome.storage.sync.clear();

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			$scope.tabId = tabs[0].id;
			$scope.tabUrl = new URL(tabs[0].url).hostname;

			chrome.storage.sync.get(['quickAccessGlobal', 'quickAccessBlacklist'], function(res) {
				
				$scope.$apply(function() {
					$scope.quickAccessGlobal = 'quickAccessGlobal' in res ? res.quickAccessGlobal : true;
					
					$scope.quickAccessBlacklist = res.quickAccessBlacklist || [];
					$scope.disableQuickAccessJusthere = $scope.quickAccessBlacklist.includes($scope.tabUrl);

					$timeout(function() {
						$scope.init = true;
					});
				});
			});
		});
	}

	$scope.toggleQuickAccessVisibility = function(show) {
		chrome.tabs.sendMessage($scope.tabId, {
			action: show ? 'showQuickAccess' : 'hideQuickAccess'
		});
	}


	$scope.readCurrentPage = function() {
		chrome.tabs.sendMessage($scope.tabId, {
			action: 'readPage'
		});
	}

	$scope.openEditor = function() {
		chrome.runtime.sendMessage({
			action: 'requestEdit'
		});
	}




	$scope.$watch('quickAccessGlobal', function(newVal) {

		if($scope.init !== true) return false;

		$timeout.cancel($scope.toggleGlobalQuickAccessTimeout);
		$scope.toggleGlobalQuickAccessTimeout = $timeout(function() {

			chrome.storage.sync.set({ quickAccessGlobal : newVal });
			//$scope.toggleQuickAccessVisibility(newVal);
			$scope.toggleQuickAccessVisibility(newVal && !$scope.disableQuickAccessJusthere);

		}, 50);
	});

	$scope.$watch('disableQuickAccessJusthere', function(newVal) {

		if($scope.init !== true) return false;

		$scope.toggleQuickAccessVisibility($scope.quickAccessGlobal && !$scope.disableQuickAccessJusthere);

		// Add to blacklist if not already added
		if( newVal && !$scope.quickAccessBlacklist.includes($scope.tabUrl) ) {
			$scope.quickAccessBlacklist.push($scope.tabUrl);
		
		// Remove from blacklist
		} else {
			var pos = $scope.quickAccessBlacklist.indexOf($scope.tabUrl);
			$scope.quickAccessBlacklist.splice(pos, 1);
		}
	});

	$scope.$watch('quickAccessBlacklist', function(newVal) {

		if($scope.init !== true) return false;

		chrome.storage.sync.set({ quickAccessBlacklist: $scope.quickAccessBlacklist });
	}, true);


	$scope.init();

}]);