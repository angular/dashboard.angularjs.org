'use strict';

// TODO(chirayu):
// - Include bootstrap css

app.directive('progressBar', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/progressBar.html',
    scope: {
      done: '=',
      total: '='
    },
    controller: function($scope, $exceptionHandler) {
      $scope.percentDone = function percentDone() {
        var percentage = $scope.done * 100 / $scope.total;
        if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
          return percentage + '%';
        } else {
          $exceptionHandler('progressBar: unable to compute progress percentage. done/total ratio is not valid.');
          return '0%';
        }
      };
    }
  };
});

