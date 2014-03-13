'use strict';

app.service('travis', ['$http', 'config', function Travis($http, config) {
  var baseUrl = 'https://api.travis-ci.org/repos/angular/'+config.githubProject+'/branches/';
  var lastStates = {};

  this.buildStatus = function(branchName) {
    var statusUrl = baseUrl + branchName;

    return $http.get(statusUrl).then(function(response) {
      var state;
      var data = response.data;
      var author = data.commit['committer_name'];
      if (data.branch.state === 'started' || data.branch.state === 'created') {
        state = lastStates[branchName];
        if (!state) {
          state = {
            happy: true,
            since: undefined,
            author: author
          };
        }
      } else {
        state = {
          // could be in progress
          happy: data.branch.state === 'passed',
          author: author,
          since: Date.parse(data.branch['finished_at'])
        }
      }
      lastStates[branchName] = state;
      return state;
    });
  };
}]);
