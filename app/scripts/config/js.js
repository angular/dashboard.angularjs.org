var config = {
  githubProject: 'angular.js',
  nextMilestone: {
    title: 'v1.2.1',
    githubName:  '1.2.1'
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

config.$providerType = 'value';

export {config};
