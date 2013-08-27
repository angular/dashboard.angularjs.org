'use strict';

describe('Service: jenkins', function() {

  // load the service's module
  beforeEach(module('dashboardApp'));

  // instantiate service
  var jenkins, $httpBackend;

  beforeEach(inject(function (_jenkins_, _$httpBackend_) {
    jenkins = _jenkins_;
    $httpBackend = _$httpBackend_;
  }));


  describe('buildStatus', function () {

    it('should return a promise for status of happy build', function () {
      var status;

      $httpBackend.expectJSONP('http://ci.angularjs.org/job/fancyApp/api/json?jsonp=JSON_CALLBACK').respond({
        color: 'blue',
        lastFailedBuild: {url: '/fake/last/sad/build'}
      });

      $httpBackend.expectJSONP('/fake/last/sad/build/api/json?jsonp=JSON_CALLBACK').respond({
        timestamp: 3333
      });

      jenkins.buildStatus('fancyApp').then(function(_status_) {
        status = _status_;
      });

      expect(status).toBeUndefined();

      $httpBackend.flush();

      expect(status).toEqual({happy: true, since: 3333});
    });


    it('should return a promise for status of sad build', function() {
      var status;

      $httpBackend.expectJSONP('http://ci.angularjs.org/job/fancyApp/api/json?jsonp=JSON_CALLBACK').respond({
        color: 'red',
        lastSuccessfulBuild: {url: '/fake/last/happy/build'}
      });

      $httpBackend.expectJSONP('/fake/last/happy/build/api/json?jsonp=JSON_CALLBACK').respond({
        timestamp: 2222
      });

      jenkins.buildStatus('fancyApp').then(function(_status_) {
        status = _status_;
      });

      expect(status).toBeUndefined();

      $httpBackend.flush();

      expect(status).toEqual({happy: false, since: 2222});
    });

  });
});

