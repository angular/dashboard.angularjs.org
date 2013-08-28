'use strict';

describe('directive: progressBar', function () {
  beforeEach(function() {
    module('dashboardApp');
    module(function($exceptionHandlerProvider) {
      $exceptionHandlerProvider.mode('log');
    });

    this.addMatchers({
      toHaveProgressBarWith: function(expected) {
        var pbWidth = new RegExp('div class="progress-bar" (.*)style="width: ' + expected + ';"');

        this.message = function() {
          return 'Expected element \'' + this.actual.html() + '\' ' + (this.isNot ? 'not ': '') +
                 'to have a progress bar with ' + expected + ' done.';
        };

        return this.actual.html().match(pbWidth);
      }
    });
  });

 it('should create the progress bar div', inject(function($compile, $rootScope, $templateCache) {
    var element = $compile('<progress-bar done="20" total="100"></progress-bar>')($rootScope);
    $rootScope.$digest();

    expect(element.html()).toEqual(
      '<div class="progress">\n' +
      '  <div class="progress-bar" ng-style="{width: percentDone()}" style="width: 20%;"></div>\n' +
      '</div>\n');
  }));

  it('should update the value based on progress change', inject(function($compile, $rootScope) {
    var element = $compile('<progress-bar done="done" total="100"></progress-bar>')($rootScope);

    $rootScope.done = 20;
    $rootScope.$digest();
    expect(element.html()).toEqual(
      '<div class="progress">\n' +
      '  <div class="progress-bar" ng-style="{width: percentDone()}" style="width: 20%;"></div>\n' +
      '</div>\n');

    $rootScope.done = 50;
    $rootScope.$digest();
    expect(element.html()).toEqual(
      '<div class="progress">\n' +
      '  <div class="progress-bar" ng-style="{width: percentDone()}" style="width: 50%;"></div>\n' +
      '</div>\n');
  }));

  it('should handle invalid directive usage', inject(function($compile, $rootScope, $exceptionHandler) {
    var element = $compile('<progress-bar done="20"></progress-bar>')($rootScope);
    $rootScope.$digest();
    expect(element.html()).toEqual(
      '<div class="progress">\n' +
      '  <div class="progress-bar" ng-style="{width: percentDone()}" style="width: 0%;"></div>\n' +
      '</div>\n');
    expect($exceptionHandler.errors).toEqual([
      'progressBar: unable to compute progress percentage. done/total ratio is not valid.',
      'progressBar: unable to compute progress percentage. done/total ratio is not valid.'
    ]);
  }));

  it('should bind done and total', inject(function($compile, $rootScope) {
    var element = $compile('<progress-bar done="done" total="total"></progress-bar>')($rootScope);

    $rootScope.$apply(function() {
      $rootScope.done = 50;
      $rootScope.total = 100;
    });
    expect(element).toHaveProgressBarWith('50%');

    $rootScope.$apply(function() {
      $rootScope.done = 100;
      $rootScope.total = 500;
    });
    expect(element).toHaveProgressBarWith('20%');
  }));
});
