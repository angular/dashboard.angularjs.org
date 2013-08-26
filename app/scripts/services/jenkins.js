'use strict';

angular.module('dashboardApp').service('jenkins', ['$http', function Jenkins($http) {

  this.buildStatus = function(jobName) {

    return $http.jsonp('http://ci.angularjs.org/job/' + jobName + '/api/json?jsonp=JSON_CALLBACK').then(function(response) {
      var happy = (response.data.color === 'blue' || response.data.color === 'blue_anime');
      var sinceUrl = happy ? response.data.lastFailedBuild.url : response.data.lastSuccessfulBuild.url;

      sinceUrl += '/api/json?jsonp=JSON_CALLBACK';

      return $http.jsonp(sinceUrl).then(function(response) {
        return {
          happy: happy,
          since: response.data.timestamp
        };
      });
    });
  };
}]);
