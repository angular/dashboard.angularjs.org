'use strict';

describe('Service: travis', function() {

  // load the service's module
  beforeEach(module('dashboardApp'));

  // instantiate service
  var travis, $httpBackend, date, dateStr;

  beforeEach(inject(function (_travis_, _$httpBackend_) {
    travis = _travis_;
    $httpBackend = _$httpBackend_;
    date = new Date(2222);
    dateStr = date.toISOString();
  }));


  describe('buildStatus', function () {

    it('should return a promise for status of happy build', function () {
      var status;

      $httpBackend.expectGET('https://api.travis-ci.org/repos/angular/angular.js/branches/fancyApp').respond({
        branch: {
          'state': 'passed',
          'finished_at': dateStr
        },
        commit: {
          'committer_name': 'some user'
        }
      });

      travis.buildStatus('fancyApp').then(function(_status_) {
        status = _status_;
      });

      expect(status).toBeUndefined();

      $httpBackend.flush();

      expect(status).toEqual({happy: true, since: 2222, author: 'some user'});
    });


    it('should return a promise for status of sad build', function() {
      var status;

      $httpBackend.expectGET('https://api.travis-ci.org/repos/angular/angular.js/branches/fancyApp').respond({
        branch: {
          'state': 'failed',
          'finished_at': dateStr
        },
        commit: {
          'committer_name': 'some user'
        }
      });

      travis.buildStatus('fancyApp').then(function(_status_) {
        status = _status_;
      });

      expect(status).toBeUndefined();

      $httpBackend.flush();

      expect(status).toEqual({happy: false, since: 2222, author: 'some user'});
    });

    it('should return the last state if the current build is in progress', function () {
      var status;

      $httpBackend.expectGET('https://api.travis-ci.org/repos/angular/angular.js/branches/fancyApp').respond({
        branch: {
          'state': 'started'
        },
        commit: { 'committer_name': 'some user' }
      });
      travis.buildStatus('fancyApp').then(function(_status_) {
        status = _status_;
      });
      $httpBackend.flush();

      // initially we assume a good build
      expect(status).toEqual({happy: true, since: undefined, author: 'some user'});

      $httpBackend.expectGET('https://api.travis-ci.org/repos/angular/angular.js/branches/fancyApp').respond({
        branch: {
          'state': 'failed',
          'finished_at': dateStr
        },
        commit: { 'committer_name': 'some user' }
      });
      travis.buildStatus('fancyApp').then(function(_status_) {
        status = _status_;
      });
      $httpBackend.flush();

      expect(status).toEqual({happy: false, since: 2222, author: 'some user'});

      $httpBackend.expectGET('https://api.travis-ci.org/repos/angular/angular.js/branches/fancyApp').respond({
        branch: {
          'state': 'started'
        },
        commit: { 'committer_name': 'some user' }
      });
      var newStatus;
      travis.buildStatus('fancyApp').then(function(_status_) {
        newStatus = _status_;
      });
      $httpBackend.flush();

      expect(newStatus).toBe(status);

    });
  });
});

