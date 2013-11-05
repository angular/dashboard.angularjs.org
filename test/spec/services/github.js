
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

  describe('Caching', function () {
    it('should cache tags', inject(function (github) {
      var tags = [ { name: 'abc' }, { name: 'def' } ]
      
      $httpBackend.when('GET', url + '/tags?').respond(tags);
  
      github.getTags();
      $httpBackend.flush();

      expect(JSON.parse(localStorage['github:getTags'])).toEqual(tags);
    }));


    it('should cache SHA counts since a tag', inject(function (github) {
      var tag = 'x';
      var branch = 'y';

      $httpBackend.when('GET', url + '/compare/' + tag + '...' + branch + '?')
        .respond({ ahead_by: 5 });

      github.getSHAsSince(branch, tag);
      $httpBackend.flush();
  
      expect(JSON.parse(localStorage['github:getSHAsSince:' + branch + ':' + tag])).toBe(5);
    }));


    it('should cache SHA counts since a release', inject(function (github) {
      var tag = { name: 'v1.2' };
      var branch = 'master';

      $httpBackend.when('GET', url + '/tags?').respond([ tag ]);
      $httpBackend.when('GET', url + '/compare/' + tag.name + '...' + branch + '?')
        .respond({ ahead_by: 5 });

      github.getSHAsSinceRelease(branch, 'v1.2');
      $httpBackend.flush();

      expect(JSON.parse(localStorage['github:getSHAsSinceRelease:' + branch])).toBe(5);
    }));


    it('should cache counts of untriaged', inject(function (github) {
      var issues = [
        { pull_request: { diff_url: null }},
        { pull_request: { diff_url: null }},
        { pull_request: { diff_url: 'http://a' }},
        { pull_request: { diff_url: 'http://b' }},
        { pull_request: { diff_url: 'http://c' }}
      ];

      $httpBackend.when('GET', url + '/issues?state=open&milestone=none&').respond(issues);
      
      github.getUntriagedCounts();
      $httpBackend.flush();

      expect(JSON.parse(localStorage['github:getUntriagedCounts'])).toEqual({
        issues: 2,
        prs: 3
      });
    }));


    it('should cache counts of open', inject(function (github) {
      var issues = [
        { pull_request: { diff_url: null }},
        { pull_request: { diff_url: null }},
        { pull_request: { diff_url: 'http://a' }},
        { pull_request: { diff_url: 'http://b' }},
        { pull_request: { diff_url: 'http://c' }}
      ];

      $httpBackend.when('GET', url + '/issues?state=open&').respond(issues);
      
      github.getAllOpenCounts();
      $httpBackend.flush();

      expect(JSON.parse(localStorage['github:getAllOpenCounts'])).toEqual({
        issues: 2,
        prs: 3
      });
    }));


    it('should cache milestone counts', inject(function (github) {
      var milestone = {
        title: 'v1.2-rc2',
        number: 2
      };
      var open_issues = [
        { state: 'open', pull_request: { diff_url: null }},
        { state: 'open', pull_request: { diff_url: null }},
        { state: 'open', pull_request: { diff_url: 'http://a' }},
        { state: 'open', pull_request: { diff_url: 'http://b' }},
        { state: 'open', pull_request: { diff_url: 'http://c' }}
      ];
      var closed_issues = [
        { state: 'closed', pull_request: { diff_url: null }},
        { state: 'closed', pull_request: { diff_url: 'http://d' }},
        { state: 'closed', pull_request: { diff_url: 'http://e' }}
      ];

      $httpBackend.when('GET', url + '/milestones?')
        .respond([ milestone ]);
      $httpBackend.when('GET', url + '/issues?state=open&milestone=' + milestone.number + '&')
        .respond(open_issues);
      $httpBackend.when('GET', url + '/issues?state=closed&milestone=' + milestone.number + '&')
        .respond(closed_issues);
      
      github.getCountsForMilestone(milestone.title);
      $httpBackend.flush();

      expect(JSON.parse(localStorage['github:getCountsForMilestone:' + milestone.title])).toEqual({
        openIssues: 2,
        openPrs: 3,
        closedIssues: 1,
        closedPrs: 2
      });
    }));
  });
});
