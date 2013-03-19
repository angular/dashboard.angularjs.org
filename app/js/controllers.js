'use strict';

var EVERY_MINUTE = 60 * 1000;
var EVERY_15_MINUTES = 15 * 60 * 1000;

/* Controllers */

function TwitterCtrl($scope, Twitter, CarouselController, Poll) {
  var tweetCarousel = CarouselController('#twitter-carousel');
  var fetchTweets = function() {
    Twitter.search({}, function(result) {
      if (result && result.results) {
        tweetCarousel.perform('pause');
        $scope.tweets = result.results;
        tweetCarousel.perform();
      }
    });
  };
  Poll(fetchTweets, EVERY_15_MINUTES)
  tweetCarousel.init();
}
TwitterCtrl.$inject = ['$scope', 'Twitter', 'CarouselController', 'Poll'];

function GPlusCtrl($scope, GPlus, CarouselController, Poll) {
  var gPlusCarousel = CarouselController('#gplus-carousel');
  var fetchPosts = function() {
    GPlus.search({}, function(result) {
      if (result && result.items) {
        gPlusCarousel.perform('pause')
        $scope.posts = result.items;
        gPlusCarousel.perform();
      }
    });
  };
  Poll(fetchPosts, EVERY_15_MINUTES);
  gPlusCarousel.init();
}
GPlusCtrl.$inject = ['$scope', 'GPlus', 'CarouselController', 'Poll'];

function BuildStatusCtrl($scope, CIBuildStatus, Poll) {
  var fetchStatus = function() {
    $scope.masterBuild = CIBuildStatus.fetch({buildname: 'angular.js-angular-master'});
    $scope.v1Build = CIBuildStatus.fetch({buildname: 'angular.js-angular-v1.0.x'});
  };
  Poll(fetchStatus, EVERY_MINUTE);
}
BuildStatusCtrl.$inject = ['$scope', 'CIBuildStatus', 'Poll'];


function IssuesCtrl($scope, GitIssues, GitRepo, Poll) {
  var fetchIssues = function() {
    GitIssues.list({}, function(issues) {
      if (issues) {
        $scope.issues = issues.data;
      }
    });
    GitRepo.fetch(function(repo) {
      $scope.numIssues = repo.data.open_issues_count;
    });
  };
  Poll(fetchIssues, EVERY_15_MINUTES);
}
IssuesCtrl.$inject = ['$scope', 'GitIssues', 'GitRepo', 'Poll'];

function PullRequestsCtrl($scope, GitPullRequests, Poll) {
  var fetchPRs =function() {
    GitPullRequests.list({}, function(prs) {
      if (prs) {
        $scope.requests = prs.data;
      }
    });
  };
  Poll(fetchPRs, EVERY_15_MINUTES);
}
PullRequestsCtrl.$inject = ['$scope', 'GitPullRequests', 'Poll'];


function BuildQueueCtrl($scope, CIQueueStatus, Poll) {
  var fetchStatus = function() {
    CIQueueStatus.fetch(function(response) {
      $scope.items = response.items;
    });
  };
  Poll(fetchStatus, EVERY_MINUTE);
}
BuildQueueCtrl.$inject = ['$scope', 'CIQueueStatus', 'Poll'];

function MailingListCtrl($scope, MailingList, Poll) {
  var fetchTopics = function() {
    MailingList.fetch(function(response) {
      $scope.topics = response.value.items;
      angular.forEach($scope.topics, function(each) {
        each.timestamp = new Date(each.pubDate).getTime();
      });
    });
  };
  Poll(fetchTopics, EVERY_15_MINUTES);
}
MailingListCtrl.$inject = ['$scope', 'MailingList', 'Poll'];

function GitCtrl(CarouselController) {
  CarouselController('#git-carousel').init(20000);
}
GitCtrl.$inject = ['CarouselController'];

function numSHAsBehind(behindBranch, headBranch) {
  var behindSHAs = behindBranch.data;
  var headSHAs = headBranch.data;

  if (behindSHAs.length == 0) { return headSHAs.length; }

  var behindTopSHA = behindSHAs[0].sha;

  for (var i = 0, ii = headSHAs.length; i < ii; i++) {
    if (headSHAs[i].sha == behindTopSHA) {
      return i;
    }
  }
  return ii;
}

function G3V1XCtrl($scope, GitCommits, Poll) {
  $scope.g3v1x = {};

  function computeSHAsBehind(model, behindBranch, headBranch) {
    model.numSHAsBehind = numSHAsBehind(behindBranch, headBranch);
  }

  var fetchData = function() {
    var masterData, g3v1xData;
    GitCommits.fetch({sha: 'g3_v1x'}, function(response) {
      if (masterData) {
        computeSHAsBehind($scope.g3v1x, response, masterData);
      } else {
        g3v1xData = response;
      }
    });
    GitCommits.fetch({sha: 'master'}, function(response) {
      if (g3v1xData) {
        computeSHAsBehind($scope.g3v1x, g3v1xData, response);
      } else {
        masterData = response;
      }
    });
  };
  Poll(fetchData, EVERY_15_MINUTES);
}
G3V1XCtrl.$inject = ['$scope', 'GitCommits', 'Poll'];
