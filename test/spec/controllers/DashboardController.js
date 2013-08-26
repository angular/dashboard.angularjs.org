'use strict';

describe('Controller: DashboardcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('dashboardApp'));

  var dashboardController,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(module(function($provide) {
    $provide.decorator('schedule', function($delegate, $timeout) {
      $delegate.flush = function() {
        $timeout.flush(60*1000);
      };

      return $delegate;
    });


    $provide.factory('jenkins', function($q) {
      return {
        buildStatus: function() {
          var deferred = $q.defer();
          deferred.resolve({
            happy: true,
            since: 1111
          });

          return deferred.promise;
        }
      };
    });
  }));


  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    dashboardController = $controller('DashboardController', {
      $scope: scope
    });
  }));

  it('should initialize buildStatus model', inject(function(schedule) {
    expect(dashboardController.buildStatus).toBeUndefined();
    schedule.flush();
    expect(dashboardController.buildStatus).toEqual({happy: true, since: 1111});
  }));
});
