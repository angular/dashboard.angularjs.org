'use strict';


// Declare app level module which depends on filters, and services
angular.module('ngDashboard', ['ngDashboard.filters', 'ngDashboard.services']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partials/twitter.html', controller: TwitterCtrl});
    $routeProvider.when('/view2', {templateUrl: 'partials/gplus.html', controller: GPlusCtrl});
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]);
