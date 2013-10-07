'use strict';

angular
    .module('github', [])
    .value('githubAuth', {
      client_id: localStorage.getItem('github.client_id'),
      client_secret: localStorage.getItem('github.client_secret')
    })
    .service('github', Github);

function Github(githubAuth, $http) {
  var url = 'https://api.github.com/repos/angular/angular.dart';
  var self = this;

  this.getTags = function() {
    var cacheKey = 'github:getTags';

    return $http
        .get(url + '/tags', {
          params: githubAuth
        })
        .then(function(response) {
          localStorage[cacheKey] = JSON.stringify(response.data);
          return response.data;
        }, function() {
          var cacheValue = localStorage[cacheKey];
          return cacheValue ? JSON.parse(cacheValue) : [];
        });
  };

  this.getLatestTagStartingWith = function(startingWith) {
    return this.getTags().then(function(tags) {
      for (var i = 0, ii = tags.length; i < ii; i++) {
        var tag = tags[i];
        if (tag.name.indexOf(startingWith) == 0) {
          return tag.name;
        }
      }
      return null;
    });
  };

  this.getSHAsSince = function(branchName, sinceTag) {
    var cacheKey = 'github:getSHAsSince:' + branchName + ':' + sinceTag;

    return $http
        .get(url + '/compare/' + sinceTag + '...' + branchName, {
          params: githubAuth
        })
        .then(function(response) {
          localStorage[cacheKey] = response.data.ahead_by;
          return response.data.ahead_by;
        }, function() {
          var cacheValue = localStorage[cacheKey];
          return cacheValue ? Number(cacheValue) : '?';
        });
  };

  this.getSHAsSinceRelease = function(branchName) {
    var startingWithTag = (branchName == 'master')
        ? 'v1.2'
        : branchName.replace(/\.x$/, '');

    var cacheKey = 'github:getSHAsSinceRelease:' + branchName;

    return this
        .getLatestTagStartingWith(startingWithTag)
        .then(function(latestTag) {
          return self.getSHAsSince(branchName, latestTag).then(function(shas) {
            localStorage[cacheKey] = shas;
            return shas;
          });
        }, function() {
          var cacheValue = localStorage[cacheKey];
          return cacheValue ? Number(cacheValue) : '?';
        });
  }


  this.getUntriagedCounts = function() {
    var counts = {issues: 0, prs: 0};
    var nextPageUrlRegExp = /<([^>]+)>; rel="next"/;

    var cacheKey = 'github:getUntriagedCounts';

    var handleResponse = function (response) {
      response.data.forEach(function(item) {
        if (item.pull_request.diff_url === null) {
          counts.issues++;
        } else {
          counts.prs++;
        }
      });

      var nextPageUrl = nextPageUrlRegExp.test(response.headers('Link')) &&
                          nextPageUrlRegExp.exec(response.headers('Link'))[1];

      if (nextPageUrl) {
        return $http.get(nextPageUrl).then(handleResponse);
      }

      localStorage[cacheKey] = JSON.stringify(counts);
      return counts;
    };

    var handleError = function () {
      var cacheValue = localStorage[cacheKey];
      return cacheValue ? JSON.parse(cacheValue) : {issues: '?', prs: '?'};
    };

    return $http
        .get(url + '/issues?state=open&milestone=none', {params: githubAuth})
        .then(handleResponse, handleError);
  };


  this.getAllOpenCounts = function() {
    var counts = {issues: 0, prs: 0};
    var nextPageUrlRegExp = /<([^>]+)>; rel="next"/;

    var cacheKey = 'github:getAllOpenCounts';

    var handleResponse = function (response) {
      response.data.forEach(function(item) {
        if (item.pull_request.diff_url === null) {
          counts.issues++;
        } else {
          counts.prs++;
        }
      });

      var nextPageUrl = nextPageUrlRegExp.test(response.headers('Link')) &&
                          nextPageUrlRegExp.exec(response.headers('Link'))[1];

      if (nextPageUrl) {
        return $http.get(nextPageUrl).then(handleResponse);
      }

      localStorage[cacheKey] = JSON.stringify(counts);
      return counts;
    };

    var handleError = function () {
      var cacheValue = localStorage[cacheKey];
      return cacheValue ? JSON.parse(cacheValue) : {issues: '?', prs: '?'};
    };

    return $http
        .get(url + '/issues?state=open', {params: githubAuth})
        .then(handleResponse, handleError);
  };


  this.getCountsForMilestone = function (title) {
    var needClosed = true;
    var milestoneNumber;
    var counts = { closedPrs: 0, openPrs: 0, openIssues: 0, closedIssues: 0, prHistory: [], issueHistory: [] },
        issueStateWithDay = {
          prs: [],
          issues: []
        };
    var nextPageUrlRegExp = /<([^>]+)>; rel="next"/;

    var cacheKey = 'github:getCountsForMilestone:' + title;

    var handleResponse = function (response) {
      response.data.forEach(function(item) {
        var isPr = !!item.pull_request.diff_url,
            countsHistoryArr = counts[isPr ? 'prHistory' : 'issueHistory'];

        var milestoneCreateDate = new Date(item.milestone['created_at']),
            createDate = new Date(item["created_at"]);
        countsHistoryArr.push({
          date: milestoneCreateDate > createDate ? milestoneCreateDate : createDate,
          state: 'open'
        });

        if (item.state === 'closed') {
          counts[isPr ? 'closedPrs' : 'closedIssues']++;
          countsHistoryArr.push({
            date: new Date(item["closed_at"]),
            state: 'closed'
          });
        }
        else {
          counts[isPr ? 'openPrs' : 'openIssues']++;
        }
      });

      var nextPageUrl = nextPageUrlRegExp.test(response.headers('Link')) &&
                          nextPageUrlRegExp.exec(response.headers('Link'))[1];

      if (nextPageUrl) {
        return $http.get(nextPageUrl).then(handleResponse);
      }

      if (needClosed) {
        needClosed = false;
        return $http
            .get(url + '/issues?state=closed&milestone=' + milestoneNumber, {params: githubAuth})
            .then(handleResponse, handleError);
      }

      localStorage[cacheKey] = JSON.stringify(counts);
      return counts;
    };

    var handleError = function () {
      var cacheValue = localStorage[cacheKey];
      return cacheValue ? JSON.parse(cacheValue) : {
        closedPrs: '?',
        openPrs: '?',
        openIssues: '?',
        closedIssues: '?',
        prHistory: [], issueHistory: []
      };
    };


    var handleMilestones = function (response) {
      response.data.forEach(function (milestone) {
        if (milestone.title === title) {
          milestoneNumber = milestone.number;
        }
      });

      return $http
          .get(url + '/issues?state=open&milestone=' + milestoneNumber, {params: githubAuth})
          .then(handleResponse, handleError);
    };

    return $http
        .get(url + '/milestones', {params: githubAuth})
        .then(handleMilestones, handleError);
  }
}

Github.$inject = ['githubAuth', '$http'];
