'use strict';

app.service('jenkins', ['$http', function Jenkins($http) {

  this.buildStatus = function(jobName) {
    var status = {};

    var statusUrl = 'http://ci.angularjs.org/job/' + jobName;
    statusUrl += '/api/json?jsonp=JSON_CALLBACK';

    return $http.jsonp(statusUrl).then(function(statusResponse) {
      var happy = (statusResponse.data.color === 'blue' || statusResponse.data.color === 'blue_anime');
      status.happy = happy;

      var sinceUrl = happy ? statusResponse.data.lastFailedBuild.url : statusResponse.data.lastSuccessfulBuild.url;
      sinceUrl += '/api/json?jsonp=JSON_CALLBACK';

      return $http.jsonp(sinceUrl).then(function(sinceResponse) {
        status.since = sinceResponse.data.timestamp;
        if (status.happy) return status;

        var authorUrl = statusResponse.data.lastSuccessfulBuild.url;
        if (!status.happy) {
          authorUrl = authorUrl.replace(/(\d+)\/$/, function(match, lastSuccessfulBuildId) {
            return (Number(lastSuccessfulBuildId) + 1) + '/';
          });
        }
        authorUrl += '/api/json?jsonp=JSON_CALLBACK';

        return $http.jsonp(authorUrl).then(function(authorResponse) {
          var author = authorResponse.data.culprits[0];
          status.author = author ? author.fullName : 'Igor Minar';
          return status;
        });
      });
    });
  };
}]);
