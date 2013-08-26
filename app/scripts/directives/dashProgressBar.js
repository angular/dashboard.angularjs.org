'use strict';

// TODO(chirayu):
// - Include bootstrap css

angular.module('dashboardApp').directive("dashProgressBar", function() {
  return {
    restrict: "A",
    // TODO(chirayu): get ng-html2js preprocess to work.
    // templateUrl: "views/dashProgressBar.html",
    template: '<div class="progress"><div class="progress-bar" ng-style="{width: percentDone()}"></div></div>',
    scope: {
      done: "@",
      total: "@"
    },
    controller: function($scope, $exceptionHandler) {
      $scope.percentDone = function percentDone() {
        var percentage = ($scope.done * 100 / $scope.total);
        if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
          return percentage + "%";
        } else {
          $exceptionHandler("dashProgressBar: unable to compute progress percentage. done/total ratio is not valid.");
          return "0%";
        }
      }
    }
  };
});

