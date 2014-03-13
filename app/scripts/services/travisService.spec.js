'use strict';

describe('Service: travis', function() {

  // load the service's module
  beforeEach(module('dashboardApp'));

  // instantiate service
  var travis, $httpBackend, date, dateStr, someUser, branchName, initStatus;

  beforeEach(inject(function (_travis_, _$httpBackend_) {
    travis = _travis_;
    $httpBackend = _$httpBackend_;
    someUser = 'some user';
    branchName = 'fancyApp';
    initStatus = travis.previousData(branchName);
  }));

  function mockBackend(state, dateInMillis) {
    var date = new Date(dateInMillis || 0);
    var dateStr = date.toISOString();
    $httpBackend.expectGET('https://api.travis-ci.org/repos/angular/angular.js/branches/'+branchName).respond({
      branch: {
        'state': state,
        'finished_at': dateStr
      },
      commit: {
        'committer_name': someUser
      }
    });
  }


  describe('buildStatus', function () {

    it('should return a promise for status of happy build', function () {
      var status;
      mockBackend('passed');

      travis.buildStatus('fancyApp').then(function(_status_) {
        status = _status_;
      });

      expect(status).toBeUndefined();

      $httpBackend.flush();

      expect(status).toEqual({happy: true, since: initStatus.lastFail, author: someUser});
    });

    it('should return a promise for status of sad build', function () {
      var status;
      var initStatus = travis.previousData(branchName);
      mockBackend('failed');

      travis.buildStatus('fancyApp').then(function(_status_) {
        status = _status_;
      });

      expect(status).toBeUndefined();

      $httpBackend.flush();

      expect(status).toEqual({happy: false, since: initStatus.lastSuccess, author: someUser});
    });

    it('should return the last state if the current build is in progress', function () {
      var status;
      mockBackend('started');
      travis.buildStatus('fancyApp').then(function(_status_) {
        status = _status_;
      });
      $httpBackend.flush();

      // initially we assume a good build
      expect(status).toEqual({happy: true, since: initStatus.lastFail, author: undefined});

      mockBackend('failed');
      travis.buildStatus('fancyApp').then(function(_status_) {
        status = _status_;
      });
      $httpBackend.flush();

      expect(status).toEqual({happy: false, since: initStatus.lastSuccess, author: 'some user'});

      mockBackend('started');
      var newStatus;
      travis.buildStatus('fancyApp').then(function(_status_) {
        newStatus = _status_;
      });
      $httpBackend.flush();

      expect(newStatus).toBe(status);

    });

    it('should return the time of the last sad build for happy builds', function () {
      var status;
      mockBackend('failed', 1111);
      travis.buildStatus('fancyApp').then(function(_status_) {
        status = _status_;
      });
      $httpBackend.flush();

      expect(status).toEqual({happy: false, since: initStatus.lastSuccess, author: someUser});

      mockBackend('passed');
      travis.buildStatus('fancyApp').then(function(_status_) {
        status = _status_;
      });
      $httpBackend.flush();

      expect(status).toEqual({happy: true, since: 1111, author: 'some user'});
    });

    it('should return the time of the last happy build for sad builds', function () {
      var status;
      mockBackend('passed', 1111);
      travis.buildStatus('fancyApp').then(function(_status_) {
        status = _status_;
      });
      $httpBackend.flush();

      expect(status).toEqual({happy: true, since: initStatus.lastFail, author: someUser});

      mockBackend('failed');
      travis.buildStatus('fancyApp').then(function(_status_) {
        status = _status_;
      });
      $httpBackend.flush();

      expect(status).toEqual({happy: false, since: 1111, author: 'some user'});
    });
  });
});

