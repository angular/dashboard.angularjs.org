'use strict';

angular
    .module('dashboardApp', ['github'])
    .controller('GitHubTestController', GitHubTestController);


function GitHubTestController(gitHub) {
  this.shasSinceMasterRelease = gitHub.getSHAsSinceSinceRelease('master');
  this.shasSinceStableRelease = gitHub.getSHAsSinceSinceRelease('v1.0.x');

  this.g3MasterBehind = gitHub.getSHAsSince('master', 'g3_v1_x');
  this.g3StableBehind = gitHub.getSHAsSince('v1.0.x', 'g3_v1_0');
}
