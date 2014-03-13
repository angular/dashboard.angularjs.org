'use strict';

app.service('travis', ['$http', 'config', function Travis($http, config) {
  var baseUrl = 'https://api.travis-ci.org/repos/angular/' + config.githubProject + '/branches/';
  var lastStates = {};
  var lastFail = {};
  var lastSuccess = {};

  function initLastDataIfNeeded(branchName) {
    var now = Date.now();
    if (!lastFail[branchName]) {
      lastFail[branchName] = now;
    }
    if (!lastSuccess[branchName]) {
      lastSuccess[branchName] = now;
    }
    if (!lastStates[branchName]) {
      lastStates[branchName] = {
        happy: true,
        since: now,
        author: undefined
      };
    }
  }

  this.previousData = function(branchName) {
    initLastDataIfNeeded(branchName);
    return {
      state: lastStates[branchName],
      lastFail: lastFail[branchName],
      lastSuccess: lastFail[branchName]
    }
  };

  this.buildStatus = function(branchName) {
    initLastDataIfNeeded(branchName);
    var statusUrl = baseUrl + branchName;

    return $http.get(statusUrl).then(function(response) {
      var state;
      var data = response.data;
      var author = data.commit['committer_name'];
      if (data.branch.state === 'started' || data.branch.state === 'created') {
        state = lastStates[branchName];
      } else {
        var happy = data.branch.state === 'passed';
        var finished = Date.parse(data.branch['finished_at']);
        if (happy) {
          lastSuccess[branchName] = finished;
          state = {
            happy: happy,
            author: author,
            since: lastFail[branchName]
          };
        } else {
          lastFail[branchName] = finished;
          state = {
            happy: happy,
            author: author,
            since: lastSuccess[branchName]
          };
        }
      }
      lastStates[branchName] = state;
      return state;
    });
  };
}]);
