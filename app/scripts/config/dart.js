var config = {
  githubProject: 'angular.dart',
  nextMilestone: {
    title: 'v0.9.1',
    githubName:  'v0.9.1'
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

config.$providerType = 'value';

export {config};
