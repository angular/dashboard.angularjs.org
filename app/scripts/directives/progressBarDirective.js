'use strict';

// TODO(chirayu):
// - Include bootstrap css

app.directive('progressBar', function() {
  return {
    restrict: 'E',
    // TODO(chirayu): get ng-html2js preprocess to work.
    // templateUrl: "views/dashProgressBar.html",
    template: '<div class="progress"><div class="progress-bar" ng-style="{width: percentDone()}"></div></div>',
    scope: {
      done: '@',
      total: '@'
    },
    controller: function($scope) {
      $scope.percentDone = function percentDone() {
        var percentage = ($scope.done * 100 / $scope.total);
        if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
          return percentage + '%';
        } else {
          throw new Error('dashProgressBar: unable to compute progress percentage. done/total ratio is not valid.');
        }
      };
    }
  };
});

