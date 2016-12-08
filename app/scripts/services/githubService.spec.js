'use strict';

/* global describe, it, expect, beforeEach, inject, module */
/* jshint camelcase: false */

describe('Github Service', function () {
  var $httpBackend;

  beforeEach(function () {
    module('github');

    localStorage.clear();

    inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
    });
  });


  var url = 'https://api.github.com/repos/angular/angular.js';

  describe('getLatestRelease', function () {
    var tags = [
      { name: 'v1.2.28' },
      { name: 'v1.3.3' },
      { name: 'v1.3.2' },
      { name: 'v1.2.27' },
      { name: 'v1.3.1'}
    ];

    it('should make a github request and get the first matching tag from the response', inject(function (github) {

      $httpBackend.expect('GET', url + '/tags?per_page=100').respond(tags);

      var latestRelease;
      var branch = { releaseTag: 'v1.3' };
      github.getLatestRelease(branch).then(function(data) { latestRelease = data; });
      $httpBackend.flush();

      expect(latestRelease).toEqual('v1.3.3');
    }));

    it('should cache the latest release', inject(function (github) {

      $httpBackend.expect('GET', url + '/tags?per_page=100').respond(tags);

      var branch = { releaseTag: 'v1.3' };
      github.getLatestRelease(branch);
      $httpBackend.flush();

      expect(JSON.parse(localStorage['github:getLatestRelease:v1.3'])).toEqual('v1.3.3');
    }));
  });

  describe('countSHAs', function() {
    it('should make a github request and get the number of commits between the two treeish references', inject(function(github) {
      $httpBackend.expect('GET', url + '/compare/v1.3.3...master?per_page=100').respond({ ahead_by: 45 });
      var count;
      github.countSHAs('master', 'v1.3.3').then(function(data) {
        count = data;
      });
      $httpBackend.flush();
      expect(count).toEqual(45);
    }));
  });

  describe('getLatestMilestone', function() {
    var milestones = [
      { name: 'milestone-1' },
      { name: 'milestone-2' },
      { name: 'milestone-3' }
    ];

    it('should make a github request and get the first milestone', inject(function(github) {
      $httpBackend.expect('GET', url + '/milestones?direction=desc&per_page=100&sort=due_date&state=open').respond(milestones);

      var latestMilestone;
      github.getLatestMilestone().then(function(data) { latestMilestone = data; });
      $httpBackend.flush();

      expect(latestMilestone).toEqual({ name: 'milestone-1' });

    }));


    it('should cache the latest milestone', inject(function (github) {
      $httpBackend.expect('GET', url + '/milestones?direction=desc&per_page=100&sort=due_date&state=open').respond(milestones);

      github.getLatestMilestone();
      $httpBackend.flush();

      expect(JSON.parse(localStorage['github:getLatestMilestone'])).toEqual({ name: 'milestone-1' });

    }));
  });

  describe('getIssueCounts', function() {

    it('should make a request to github with the correct params', inject(function(github) {

      $httpBackend.expect('GET', url + '/issues?milestone=12&per_page=100&state=open').respond([]);
      github.getIssueCounts({ number: 12 },'open');
      $httpBackend.flush();

      $httpBackend.expect('GET', url + '/issues?milestone=12&per_page=100&state=all').respond([]);
      github.getIssueCounts({ number: 12 });
      $httpBackend.flush();

      $httpBackend.expect('GET', url + '/issues?per_page=100&state=open').respond([]);
      github.getIssueCounts(undefined,'open');
      $httpBackend.flush();

      $httpBackend.expect('GET', url + '/issues?per_page=100&state=all').respond([]);
      github.getIssueCounts();
      $httpBackend.flush();

      $httpBackend.expect('GET', url + '/issues?milestone=none&per_page=100&state=open').respond([]);
      github.getIssueCounts('none', 'open');
      $httpBackend.flush();

      $httpBackend.expect('GET', url + '/issues?milestone=none&per_page=100&state=all').respond([]);
      github.getIssueCounts('none');
      $httpBackend.flush();
    }));

    var openDate1 = new Date();
    var openDate2 = new Date(openDate1.getTime()+1000);
    var openDate3 = new Date(openDate2.getTime()+1000);
    var closedDate1 = new Date(openDate1.getTime()+500);
    var closedDate2 = new Date(closedDate1.getTime()+1000);
    var closedDate3 = new Date(closedDate2.getTime()+1000);

    var issueResponse = [
      { state: 'open', pull_request: { diff_url: null }, 'created_at': openDate1},
      { state: 'open', pull_request: { diff_url: null }, 'created_at': openDate2},
      { state: 'open', pull_request: { diff_url: 'http://a' }, 'created_at': openDate3},
      { state: 'closed', pull_request: { diff_url: null }, 'closed_at': closedDate1, 'created_at': openDate1},
      { state: 'closed', pull_request: { diff_url: 'http://d' }, 'closed_at': closedDate2, 'created_at': openDate2},
      { state: 'open', pull_request: { diff_url: 'http://b' }, 'created_at': openDate1},
      { state: 'open', pull_request: { diff_url: 'http://c' }, 'created_at': openDate2},
      { state: 'closed', pull_request: { diff_url: 'http://e' }, 'closed_at': closedDate3, 'created_at': openDate3}
    ];

    it('should respond with an object containing the count info', inject(function(github) {

      $httpBackend.expect('GET', url + '/issues?per_page=100&state=all').respond(issueResponse);
      var countInfo;
      github.getIssueCounts().then(function(data) {
        countInfo = data;
      });
      $httpBackend.flush();

      expect(countInfo.prs.openCount).toEqual(3);
      expect(countInfo.prs.closedCount).toEqual(2);

      expect(countInfo.issues.openCount).toEqual(2);
      expect(countInfo.issues.closedCount).toEqual(1);

      expect(countInfo.prs.itemHistory).toEqual([
        { date : openDate3, state : 'open' },
        { date : openDate2, state : 'open' },
        { date : closedDate2, state : 'closed' },
        { date : openDate1, state : 'open' },
        { date : openDate2, state : 'open' },
        { date : openDate3, state : 'open' },
        { date : closedDate3, state : 'closed' }
      ]);
      expect(countInfo.issues.itemHistory).toEqual([
        { date : openDate1, state : 'open' },
        { date : openDate2, state : 'open' },
        { date : openDate1, state : 'open' },
        { date : closedDate1, state : 'closed' }
      ]);
    }));


    it('should cache the count info', inject(function(github) {

      function parseDateReviver(k,v) {
        return (k === 'date') ? new Date(v) : v;
      }

      $httpBackend.expect('GET', url + '/issues?milestone=1&per_page=100&state=open').respond(issueResponse);
      github.getIssueCounts({ number: 1 }, 'open');
      $httpBackend.flush();

      var countInfo = JSON.parse(localStorage['github:getCountsFor:open:1'], parseDateReviver);

      expect(countInfo.prs.openCount).toEqual(3);
      expect(countInfo.prs.closedCount).toEqual(2);

      expect(countInfo.issues.openCount).toEqual(2);
      expect(countInfo.issues.closedCount).toEqual(1);

      expect(countInfo.prs.itemHistory).toEqual([
        { date : openDate3, state : 'open' },
        { date : openDate2, state : 'open' },
        { date : closedDate2, state : 'closed' },
        { date : openDate1, state : 'open' },
        { date : openDate2, state : 'open' },
        { date : openDate3, state : 'open' },
        { date : closedDate3, state : 'closed' }
      ]);
      expect(countInfo.issues.itemHistory).toEqual([
        { date : openDate1, state : 'open' },
        { date : openDate2, state : 'open' },
        { date : openDate1, state : 'open' },
        { date : closedDate1, state : 'closed' }
      ]);
    }));

  });
});
