'use strict';

angular.module('dashboardApp').service('schedule', ['$timeout', function Schedule($timeout) {

  this.onceAMinute = function(task) {
    $timeout(function repeat() {
      task();
      $timeout(repeat, 60*1000);
    }, 0);
  };

}]);
