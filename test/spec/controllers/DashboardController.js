'use strict';

describe('Controller: DashboardcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('dashboard.angularjs.orgApp'));

  var DashboardcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DashboardcontrollerCtrl = $controller('DashboardcontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
