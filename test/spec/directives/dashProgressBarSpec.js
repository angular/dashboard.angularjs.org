'use strict';

describe('Directive: dashProgressBar', function () {
  beforeEach(function() {
    module('dashboardApp');
    module(function($exceptionHandlerProvider) {
      $exceptionHandlerProvider.mode('log');
    });
  });

  it('should create the progress bar div', inject(function($compile, $rootScope, $templateCache) {
    var element = $compile('<div dash-progress-bar done="20" total="100"></div>')($rootScope);
    expect(element.html()).toEqual(
        '<div class="progress"><div class="progress-bar" ng-style="{width: percentDone()}"></div></div>');
    $rootScope.$digest();
    expect(element.html()).toEqual(
        '<div class="progress"><div class="progress-bar" ng-style="{width: percentDone()}" style="width: 20%;"></div></div>');
  }));

  it('should update the value based on progress change', inject(function($compile, $rootScope) {
    var element = $compile('<div dash-progress-bar done="{{done}}" total="100"></div>')($rootScope);
    expect(element.html()).toEqual(
        '<div class="progress"><div class="progress-bar" ng-style="{width: percentDone()}"></div></div>');
    $rootScope.done = 20;
    $rootScope.$digest();
    expect(element.html()).toEqual(
        '<div class="progress"><div class="progress-bar" ng-style="{width: percentDone()}" style="width: 20%;"></div></div>');
    $rootScope.done = 50;
    $rootScope.$digest();
    expect(element.html()).toEqual(
        '<div class="progress"><div class="progress-bar" ng-style="{width: percentDone()}" style="width: 50%;"></div></div>');
  }));

  it('should handle invalid directive usage', inject(function($compile, $rootScope, $exceptionHandler) {
    var element = $compile('<div dash-progress-bar done="20"></div>')($rootScope);
    expect(element.html()).toEqual(
        '<div class="progress"><div class="progress-bar" ng-style="{width: percentDone()}"></div></div>');
    $rootScope.$digest();
    expect(element.html()).toEqual(
        '<div class="progress"><div class="progress-bar" ng-style="{width: percentDone()}" style="width: 0%;"></div></div>');
    expect($exceptionHandler.errors).toEqual([
        "dashProgressBar: unable to compute progress percentage. done/total ratio is not valid.",
        "dashProgressBar: unable to compute progress percentage. done/total ratio is not valid."
        ]);
  }));

});
