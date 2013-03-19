'use strict';

/* jasmine specs for controllers go here */
describe('Controllers', function() {

  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  beforeEach(module('ngDashboard.services'));

  describe('TwitterCtrl', function(){
    var $httpBackend, scope, twitterCtrl, resultTweetData, carouselLog, timeout;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $timeout, $controller) {
      timeout = $timeout;
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
      carouselLog = '';
      resultTweetData = function() {
        return {
          completed_in: 0.031,
          page: 1,
          results: [
            {
              text: 'Tweet 1',
              from_user: 'BoringUser'
            },
            {
              text: 'Tweeeeeeeeeeetieeee',
              from_user: 'TweetyBird'
            }
          ]
        };
      };
      $httpBackend.expectJSONP(
          'http://search.twitter.com/search.json?callback=JSON_CALLBACK&q=angular.js+AngularJS&result_type=recent&rpp=25').
          respond(resultTweetData());
      twitterCtrl = $controller(TwitterCtrl, {
        $scope: scope,
        CarouselController: function(id) {
          return {
            init: function() {
              carouselLog += 'init;';
            },
            perform: function(event) {
              carouselLog += 'event:' + event + ';';
            }
          };
        }
      });
    }));


    it('should fetch tweets and store results', function() {
      expect(scope.tweets).not.toBeDefined();
      expect(carouselLog).toEqual('init;');
      $httpBackend.flush();
      expect(carouselLog).toEqual('init;event:pause;event:undefined;');
      expect(scope.tweets).toEqualData(resultTweetData().results);
    });

    it('should refetch tweets after time interval', function() {
      $httpBackend.flush();
      expect(scope.tweets).toEqualData(resultTweetData().results);

      var newTweet = {results: [{text: 'New Tweet'}]};
      $httpBackend.expectJSONP(
          'http://search.twitter.com/search.json?callback=JSON_CALLBACK&q=angular.js+AngularJS&result_type=recent&rpp=25').
          respond(newTweet);
      timeout.flush();
      $httpBackend.flush();
      expect(scope.tweets).toEqualData(newTweet.results);
    });
  });

  describe('GPlusCtrl', function(){
    var gPlusCtrl, $httpBackend, scope, resultGPlusData, carouselLog, timeout;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $timeout, $controller) {
      timeout = $timeout;
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
      carouselLog = '';
      resultGPlusData = function() {
        return {
          updated: '2012-09-02T12:34:12.242Z',
          id: '12312321',
          items: [
            {
              title: 'Something awesome',
              published: '2012-06-02T12:34:12.242Z',
              actor: {displayName: 'Tweety Bird'},
              object: {content: 'This tweeet is now a gplus post'}
            },
            {
              title: 'Something more awesome',
              published: '2012-06-07T12:34:12.242Z',
              actor: {displayName: 'Felix the cat'},
              object: {content: 'Tweety bird was tasty. :)'}
            }
          ]
        };
      };
      $httpBackend.expectJSONP(
          'https://www.googleapis.com/plus/v1/activities?callback=JSON_CALLBACK&key=AIzaSyDT6UOJ1M9CgEz9IWVwxYH89PHldGm_uJo&maxResults=20&orderBy=recent&query=angular.js+AngularJS').
          respond(resultGPlusData());

      gPlusCtrl = $controller(GPlusCtrl, {
        $scope: scope,
        CarouselController: function(id) {
          return {
            init: function() {
              carouselLog += 'init;';
            },
            perform: function(event) {
              carouselLog += 'event:' + event + ';';
            }
          };
        }
      });
    }));


    it('should fetch and store gplus results for display', function() {
      expect(scope.posts).not.toBeDefined();
      expect(carouselLog).toEqual('init;');

      $httpBackend.flush();

      expect(carouselLog).toEqual('init;event:pause;event:undefined;');
      expect(scope.posts).toEqualData(resultGPlusData().items);
    });

    it('should refetch results after time interval', function() {
      $httpBackend.flush();
      expect(scope.tweets).toEqualData(resultGPlusData().results);

      var newPost = {items: [{text: 'New Post'}]};
      $httpBackend.expectJSONP(
          'https://www.googleapis.com/plus/v1/activities?callback=JSON_CALLBACK&key=AIzaSyDT6UOJ1M9CgEz9IWVwxYH89PHldGm_uJo&maxResults=20&orderBy=recent&query=angular.js+AngularJS').
          respond(newPost);
      timeout.flush();
      $httpBackend.flush();
      expect(scope.tweets).toEqualData(newPost.results);
    });
  });

  describe('BuildStatusCtrl()', function(){
    var ciBuildCtrl, $httpBackend, scope, timeout;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $timeout, $controller) {
      timeout = $timeout;
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
      $httpBackend.expectJSONP(
          'http://ci.angularjs.org/job/angular.js-angular-master/api/json?jsonp=JSON_CALLBACK').
          respond({name: 'master'});
      $httpBackend.expectJSONP(
          'http://ci.angularjs.org/job/angular.js-angular-v1.0.x/api/json?jsonp=JSON_CALLBACK').
          respond({name: 'v1x'});
      ciBuildCtrl = $controller(BuildStatusCtrl, {$scope: scope});
    }));


    it('should fetch status of both builds', function() {
      expect(scope.masterBuild).toEqualData({})
      expect(scope.v1Build).toEqualData({});
      $httpBackend.flush();
      expect(scope.masterBuild).toEqualData({name: 'master'});
      expect(scope.v1Build).toEqualData({name: 'v1x'});
    });

    it('should check status of build repeatedly', function() {
      $httpBackend.flush();
      expect(scope.masterBuild).toEqualData({name: 'master'});
      expect(scope.v1Build).toEqualData({name: 'v1x'});

      $httpBackend.expectJSONP(
          'http://ci.angularjs.org/job/angular.js-angular-master/api/json?jsonp=JSON_CALLBACK').
          respond({name: 'masterNew'});
      $httpBackend.expectJSONP(
          'http://ci.angularjs.org/job/angular.js-angular-v1.0.x/api/json?jsonp=JSON_CALLBACK').
          respond({name: 'v1xNew'});
      timeout.flush();
      $httpBackend.flush();
      expect(scope.masterBuild).toEqualData({name: 'masterNew'});
      expect(scope.v1Build).toEqualData({name: 'v1xNew'});

    });
  });

  describe('numSHAsBehind', function() {
    var EMPTY_DATA = { data: [] };
    it('should return 0 for with no SHAs', function() {
      var behindData = EMPTY_DATA;
      var headData = EMPTY_DATA;
      expect(numSHAsBehind(behindData, headData)).toEqual(0);
    });

    it('should return the number of SHAs in head if "behind" is empty',
        function() {
      var behindData = EMPTY_DATA;
      var headData = { data: [ {sha: "a"}]};
      expect(numSHAsBehind(behindData, headData)).toEqual(1);
    });

    it('should return the number of SHAs between head and behind', function() {
      var behindData = { data: [
        {sha: 'a'}
      ]};
      var headData = { data: [
        {sha: 'd'},
        {sha: 'c'},
        {sha: 'b'},
        {sha: 'a'}
      ]};
      expect(numSHAsBehind(behindData, headData)).toEqual(3);
    });

    it('should return 0 for up-to-date "behind"', function () {
      var data = { data: [{sha: 'a'}, {sha:'b'}]};
      expect(numSHAsBehind(data, data)).toEqual(0);
    });

    it('should return a large number when head does not contain behind', function(){
      var behindData = { data: [{sha: 'a'}, {sha:'b'}]};
      var headData = { data: [{sha: 'c'}, {sha:'d'}]};
      expect(numSHAsBehind(behindData, headData)).toEqual(2);
    })
  });

  describe('G3V1XCtrl', function() {
    var $httpBackend, scope, g3v1xCtrl, resultMasterData, resultMasterDataNext, resultG3V1XData, timeout;

    var MASTER_URL = 'https://api.github.com/repos/angular/angular.js/commits?callback=JSON_CALLBACK&sha=master';
    var G3_URL = 'https://api.github.com/repos/angular/angular.js/commits?callback=JSON_CALLBACK&sha=g3_v1x';

    beforeEach(inject(function(_$httpBackend_, $rootScope, $timeout, $controller) {
      timeout = $timeout;
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
      resultMasterData = function() {
        return { 'data': [
          {'sha': 'masterA'},
          {'sha': 'masterB'},
          {'sha': 'bothA'},
          {'sha': 'bothB'}
        ]};
      };
      resultMasterDataNext = function() {
        return { 'data': [
          {'sha': 'masterFartherAhead'},
          {'sha': 'masterA'},
          {'sha': 'masterB'},
          {'sha': 'bothA'},
          {'sha': 'bothB'}
        ]};
      };
      resultG3V1XData = function() {
        return { 'data': [
          {'sha': 'bothA'},
          {'sha': 'bothB'}
        ]};
      };
      $httpBackend.expectJSONP(G3_URL).respond(resultG3V1XData());
      $httpBackend.expectJSONP(MASTER_URL).respond(resultMasterData());
      g3v1xCtrl = $controller(G3V1XCtrl, {$scope: scope});
    }));

    it('should fetch number of SHAs behind on load', function() {
      expect(scope.g3v1x.numSHAsBehind).not.toBeDefined();
      $httpBackend.flush();
      expect(scope.g3v1x.numSHAsBehind).toEqual(2);
    });

    it('should fetch number of SHAs on poll', function() {
      $httpBackend.flush();
      $httpBackend.expectJSONP(G3_URL).respond(resultG3V1XData());
      $httpBackend.expectJSONP(MASTER_URL).respond(resultMasterDataNext());
      timeout.flush();
      $httpBackend.flush();
      expect(scope.g3v1x.numSHAsBehind).toEqual(3);
    });
  });

  describe('IssuesCtrl()', function(){
    var issuesCtrl, $httpBackend, scope, issuesData, summaryData, timeout;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $timeout, $controller) {
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
      timeout = $timeout;
      summaryData = function() {
        return {data: {open_issues_count: 435}};
      };
      issuesData = function() {
        return {
          data: [
            {
              url: 'http://issue/1',
              title: 'This is a bug',
              body: 'A bigggg bugggg, not a dig dug',
              user: { login: 'username', id: 23},
              created_at: '2011-12-23T22:43:22Z'
            },
            {
              url: 'http://issue/23',
              title: 'This is not a bug',
              body: 'A dig dug that is not a bug',
              user: { login: 'angular', id: 666},
              created_at: '2011-11-23T22:43:22Z'
            }
          ]
        }
      };
      $httpBackend.expectJSONP(
          'https://api.github.com/repos/angular/angular.js/issues?callback=JSON_CALLBACK&direction=desc&milestone=*&per_page=20&sort=created&state=open').
          respond(issuesData());
      $httpBackend.expectJSONP(
          'https://api.github.com/repos/angular/angular.js?callback=JSON_CALLBACK').
          respond(summaryData());
      issuesCtrl = $controller(IssuesCtrl, {$scope: scope});
    }));


    it('should fetch issues and num issues on load', function() {
      expect(scope.issues).not.toBeDefined();
      $httpBackend.flush();
      expect(scope.issues).toEqualData(issuesData().data);
      expect(scope.numIssues).toEqual(435);
    });

    it('should fetch every interval', function() {
      $httpBackend.flush();
      expect(scope.issues).toEqualData(issuesData().data);
      expect(scope.numIssues).toEqual(435);

      $httpBackend.expectJSONP(
          'https://api.github.com/repos/angular/angular.js/issues?callback=JSON_CALLBACK&direction=desc&milestone=*&per_page=20&sort=created&state=open').
          respond({data: ['1', '2']});
      $httpBackend.expectJSONP(
          'https://api.github.com/repos/angular/angular.js?callback=JSON_CALLBACK').
          respond({data: {open_issues_count: 5}});
      timeout.flush();
      $httpBackend.flush();

      expect(scope.issues).toEqualData(['1', '2']);
      expect(scope.numIssues).toEqual(5);
    });
  });

  describe('PullRequestsCtrl()', function(){
    var pullRequestsCtrl, $httpBackend, scope, pullRequestsData, timeout;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $timeout, $controller) {
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
      timeout = $timeout;
      pullRequestsData = function() {
        return {
          data: [
            {
              url: 'http://pr/1',
              title: 'Pull this in',
              body: 'Pulllll!!!!!',
              state: 'open',
              user: { login: 'username', id: 23},
              created_at: '2011-12-23T22:43:22Z'
            },
            {
              url: 'http://pr/23',
              title: 'And haul this one in too',
              body: 'PR is not Public Relations',
              state: 'open',
              user: { login: 'angular', id: 666},
              created_at: '2011-11-23T22:43:22Z'
            }]
        };
      };
      $httpBackend.expectJSONP(
          'https://api.github.com/repos/angular/angular.js/pulls?callback=JSON_CALLBACK&per_page=100&state=open').
          respond(pullRequestsData());
      pullRequestsCtrl = $controller(PullRequestsCtrl, {$scope: scope});
    }));


    it('should fetch pull requests on load', function() {
      expect(scope.requests).not.toBeDefined();
      $httpBackend.flush();
      expect(scope.requests).toEqualData(pullRequestsData().data);
    });

    it('should fetch every interval', function() {
      $httpBackend.flush();
      expect(scope.requests).toEqualData(pullRequestsData().data);

      $httpBackend.expectJSONP(
          'https://api.github.com/repos/angular/angular.js/pulls?callback=JSON_CALLBACK&per_page=100&state=open').
          respond({data: ['1', '2']});
      timeout.flush();
      $httpBackend.flush();

      expect(scope.requests).toEqualData(['1', '2']);
    });

  });

  describe('BuildQueueCtrl()', function(){
    var buildQCtrl, $httpBackend, scope, buildQData, timeout;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $timeout, $controller) {
      $httpBackend = _$httpBackend_;
      timeout = $timeout;
      scope = $rootScope.$new();
      buildQData = function() {
        return {
          items: [
            {
              title: 'Pull this in',
              created_at: '2011-12-23T22:43:22Z'
            },
            {
              title: 'And haul this one in too',
              created_at: '2011-11-23T22:43:22Z'
            }]
        };
      };
      $httpBackend.expectJSONP(
          'http://ci.angularjs.org/queue/api/json?jsonp=JSON_CALLBACK').
          respond(buildQData());
      buildQCtrl = $controller(BuildQueueCtrl, {$scope: scope});
    }));


    it('should fetch pull requests on load', function() {
      expect(scope.items).not.toBeDefined();
      $httpBackend.flush();
      expect(scope.items).toEqualData(buildQData().items);
    });

    it('should fetch every interval', function() {
      $httpBackend.flush();
      expect(scope.items).toEqualData(buildQData().items);

      $httpBackend.expectJSONP(
          'http://ci.angularjs.org/queue/api/json?jsonp=JSON_CALLBACK').
          respond({items: ['1', '2']});
      timeout.flush();
      $httpBackend.flush();

      expect(scope.items).toEqualData(['1', '2']);
    });
  });

  describe('MailingListCtrl()', function(){
    var mailingListCtrl, $httpBackend, scope, mailingListData, timeout, ts1, ts2;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $timeout, $controller) {
      $httpBackend = _$httpBackend_;
      timeout = $timeout;
      scope = $rootScope.$new();
      ts1 = 'Fri, 07 Sep 2012 01:03:33 UT';
      ts2 = 'Mon, 10 Sep 2012 05:33:11 UT';

      mailingListData = function() {
        return { value: {
          items: [
            {
              title: 'Pull this in',
              pubDate: ts1
            },
            {
              title: 'And haul this one in too',
              pubDate: ts2
            }]
        }};
      };
      $httpBackend.expectJSONP(
          'http://pipes.yahoo.com/pipes/pipe.run?_callback=JSON_CALLBACK&_id=eb2f12001ea44da6df729515f2de587c&_render=json').
          respond(mailingListData());
      mailingListCtrl = $controller(MailingListCtrl, {$scope: scope});
    }));


    it('should fetch topics on load', function() {
      expect(scope.topics).not.toBeDefined();
      $httpBackend.flush();
      var expectedData = mailingListData().value.items;
      expectedData[0].timestamp = new Date(ts1).getTime();
      expectedData[1].timestamp = new Date(ts2).getTime();
      expect(scope.topics).toEqualData(expectedData);
    });

    it('should fetch every interval', function() {
      $httpBackend.flush();
      var expectedData = mailingListData().value.items;
      expectedData[0].timestamp = new Date(ts1).getTime();
      expectedData[1].timestamp = new Date(ts2).getTime();
      expect(scope.topics).toEqualData(expectedData);

      $httpBackend.expectJSONP(
          'http://pipes.yahoo.com/pipes/pipe.run?_callback=JSON_CALLBACK&_id=eb2f12001ea44da6df729515f2de587c&_render=json').
          respond({value: {items: [{pubDate: ts2}]}});
      timeout.flush();
      $httpBackend.flush();

      expect(scope.topics).toEqualData([{pubDate: ts2, timestamp: new Date(ts2).getTime()}]);
    });
  })
});
