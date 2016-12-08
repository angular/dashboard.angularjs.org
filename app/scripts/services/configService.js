'use strict';

var angularJsConfig = {
  githubProject: 'angular.js',
  branches: {
    master: {
      title: 'master/1.6',
      name: 'master',
      g3Name: 'g3_v1_6',
      releaseTag: 'v1.6',
      jenkinsProjectId: 'angular.js-angular-master'
    },
    stable: {
      title: 'stable/1.5',
      name: 'v1.5.x',
      g3Name: 'g3_v1_5',
      releaseTag: 'v1.5',
      jenkinsProjectId: 'angular.js-angular-v1.5.x'
    },
    legacy: {
      title: 'legacy/1.2',
      name: 'v1.2.x',
      g3Name: 'g3_v1_2',
      releaseTag: 'v1.2',
      jenkinsProjectId: 'angular.js-angular-v1.2.x'
    }
  }
};

var angularDartConfig = {
  githubProject: 'angular.dart',
  branches: {
    master: {
      title: 'master',
      name: 'master',
      g3Name: 'g3v1x-master',
      releaseTag: 'v1.1.0',
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
