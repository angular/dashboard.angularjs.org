'use strict';

describe('github', function() {
  function gitUrl(url) {
    return 'https://api.github.com/repos/angular/angular.js' + url +
        '?client_id=ID&client_secret=SECRET';
  }

  beforeEach(module('github'));
  beforeEach(module(function($provide) {
    $provide.value('gitHubAuth', { client_id: 'ID', client_secret: 'SECRET' });
  }));

  it('should return a list of tags', inject(function(gitHub, $rootScope, $httpBackend) {
    $httpBackend.expectGET(gitUrl('/tags')).respond([
      {name: 'tag1'}
    ]);

    var tags;
    gitHub.getTags().then(function(v) { tags = v; });
    $rootScope.$digest();
    $httpBackend.flush();

    expect(tags).toEqual([
      {name: 'tag1'}
    ]);
  }));


  describe('untriagedCounts', function() {
    // Link: <https://api.github.com/repositories/460078/issues?state=open&page=2>; rel="next", <https://api.github.com/repositories/460078/issues?state=open&page=17>; rel="last"
    // [{pull_request: {diff_url: "https://..."}}]
  });
});
