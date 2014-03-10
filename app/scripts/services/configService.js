'use strict';

var angularJsConfig = {
  githubProject: 'angular.js',
  nextMilestone: {
    title: 'v1.3.0-beta.2',
    githubName:  '1.3.0-beta.2'
  },
  branches: {
    master: {
      title: 'master',
      name: 'master',
      g3Name: 'g3_v1_3',
      releaseTag: 'v1.3',
      jenkinsProjectId: 'angular.js-angular-master'
    },
    stable: {
      title: 'stable/1.2',
      name: 'v1.2.x',
      g3Name: 'g3_v1_2',
      releaseTag: 'v1.2',
      jenkinsProjectId: 'angular.js-angular-v1.2.x'
    }
  }
};

var angularDartConfig = {
  githubProject: 'angular.dart',
  nextMilestone: {
    title: 'v0.9.9',
    githubName:  'v0.9.9'
  },
  branches: {
    master: {
      title: 'master',
      name: 'master',
      g3Name: 'g3v1x',
      jenkinsProjectId: 'angular.dart-master'
    }
  }
};


var Config$inject = ['$location'];
function Config($location) {
  return ($location.host().indexOf('angulardart') == -1) ?
      angularJsConfig : angularDartConfig;
}
Config.$inject = Config$inject;

angular
    .module('config', [])
    .factory('config', Config);
