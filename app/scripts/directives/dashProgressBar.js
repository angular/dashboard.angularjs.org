'use strict';

// TODO(chirayu):
// - Include bootstrap css

angular.module('dashboardApp').directive("dashProgressBar", function() {
  return {
    restrict: "A",
    // TODO(chirayu): get ng-html2js preprocess to work.
    // templateUrl: "views/dashProgressBar.html",
    template: '<div class="progress"><div class="bar" style="width: {{percentDone()}}%"></div></div>',
    scope: {
      done: "@",
      total: "@"
    },
    controller: function($scope) {
      $scope.percentDone = function percentDone() {
        return ($scope.done * 100 / $scope.total) || 0;
      }
    }
  };
});

