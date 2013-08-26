'use strict';

angular.module('dashboardApp').controller('DashboardController',
    ['jenkins', 'schedule', function DashboardController(jenkins, schedule) {

  var self = this;

  schedule.onceAMinute(function() {
    jenkins.buildStatus('angular.js-angular-master').then(function(buildStatus) {
      console.log('build status', buildStatus)
      self.buildStatus = buildStatus;
    });
  });
}]);
