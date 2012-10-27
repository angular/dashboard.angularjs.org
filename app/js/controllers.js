'use strict';

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
  Poll(fetchTweets, 15 * 60 * 1000)
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
  Poll(fetchPosts, 15 * 60 * 1000);
  gPlusCarousel.init();
}
GPlusCtrl.$inject = ['$scope', 'GPlus', 'CarouselController', 'Poll'];

function BuildStatusCtrl($scope, CIBuildStatus, Poll) {
  var fetchStatus = function() {
    $scope.masterBuild = CIBuildStatus.fetch({buildname: 'angular.js-angular-master'});
    $scope.v1Build = CIBuildStatus.fetch({buildname: 'angular.js-angular-v1.0.x'});
  };
  Poll(fetchStatus, 60 * 1000);
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
  Poll(fetchIssues, 15 * 60 * 1000);
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
  Poll(fetchPRs, 15 * 60 * 1000);
}
PullRequestsCtrl.$inject = ['$scope', 'GitPullRequests', 'Poll'];


function BuildQueueCtrl($scope, CIQueueStatus, Poll) {
  var fetchStatus = function() {
    CIQueueStatus.fetch(function(response) {
      $scope.items = response.items;
    });
  };
  Poll(fetchStatus, 60 * 1000);
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
  Poll(fetchTopics, 15 * 60 * 1000);
}
MailingListCtrl.$inject = ['$scope', 'MailingList', 'Poll'];

function GitCtrl(CarouselController) {
  CarouselController('#git-carousel').init(20000);
}
GitCtrl.$inject = ['CarouselController'];
