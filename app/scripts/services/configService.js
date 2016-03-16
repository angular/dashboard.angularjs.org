'use strict';

var angularJsConfig = {
  githubProject: 'angular.js',
  branches: {
    master: {
      title: 'master',
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
      title: 'legacy/1.4',
      name: 'v1.4.x',
      g3Name: 'g3_v1_4',
      releaseTag: 'v1.4',
      jenkinsProjectId: 'angular.js-angular-v1.4.x'
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
