'use strict';

var angularJsConfig = {
  githubProject: 'angular.js',
  nextMilestone: {
    title: 'v1.2.14',
    githubName:  '1.2.14'
  },
  branches: {
    master: {
      title: 'master',
      name: 'master',
      g3Name: 'g3_v1_2',
      releaseTag: 'v1.2',
      jenkinsProjectId: 'angular.js-angular-master'
    },
    stable: {
      title: 'stable/1.0',
      name: 'v1.0.x',
      g3Name: 'g3_v1_0',
      releaseTag: 'v1.0',
      jenkinsProjectId: 'angular.js-angular-v1.0.x'
    }
  }
};

var angularDartConfig = {
  githubProject: 'angular.dart',
  nextMilestone: {
    title: 'v0.9.8',
    githubName:  'v0.9.8'
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
