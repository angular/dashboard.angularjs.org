'use strict';

describe('Directive: dashProgressBar', function () {
  beforeEach(module('dashboardApp'));

  it('should create the progress bar div', inject(function($compile, $rootScope, $templateCache) {
    var element = $compile('<div dash-progress-bar done="20" total="100"></div>')($rootScope);
    expect(element.html()).toEqual(
        '<div class="progress"><div class="bar" style="width: {{percentDone()}}%"></div></div>');
    $rootScope.$digest();
    expect(element.html()).toEqual(
        '<div class="progress"><div class="bar" style="width: 20%"></div></div>');
  }));

  it('should update the value based on progress change', inject(function($compile, $rootScope) {
    var element = $compile('<div dash-progress-bar done="{{done}}" total="100"></div>')($rootScope);
    expect(element.html()).toEqual(
        '<div class="progress"><div class="bar" style="width: {{percentDone()}}%"></div></div>');
    $rootScope.done = 20;
    $rootScope.$digest();
    expect(element.html()).toEqual(
        '<div class="progress"><div class="bar" style="width: 20%"></div></div>');
    $rootScope.done = 50;
    $rootScope.$digest();
    expect(element.html()).toEqual(
        '<div class="progress"><div class="bar" style="width: 50%"></div></div>');
  }));

});
