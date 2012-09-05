'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

  beforeEach(function() {
    browser().navigateTo('../../app/index.html');
  });

  it('should render display build status', function() {
    expect(element('.buildStatus:first>h3').text()).toEqual('angular.js-angular-master');
    expect(element('.buildStatus:last>h3').text()).toEqual('angular.js-angular-v1.0.x');
  });

  it('should render build queue', function() {
    expect(element('.widgetContainer.well h4').text()).toEqual('Builds in Queue 0');
  });
});
