'use strict';

/* Filters */

angular.module('ngDashboard.filters', []).
  filter('sinceTime', function() {
    return function(date, currentTime) {
      currentTime = currentTime || new Date().getTime();
      var origTime = angular.isDate(date) ? date.getTime() : date;
      var difference = currentTime - origTime;
      var diffInSeconds = difference / 1000;
      if (diffInSeconds < 60) {
        return Math.round(diffInSeconds) + ' seconds';
      } else if (diffInSeconds < 60 * 60) {
        return Math.round(diffInSeconds / 60) + ' minutes';
      } else if (diffInSeconds < 60 * 60 * 24) {
        return Math.round(diffInSeconds / (60 * 60)) + ' hours';
      } else {
        return Math.round(diffInSeconds / (60 * 60 * 24)) + ' days';
      }
    };
  });
