'use strict';

angular
    .module('github', [])
    .value('gitHubAuth', {
      client_id: localStorage.getItem('github.client_id'),
      client_secret: localStorage.getItem('github.client_secret')
    })
    .service('gitHub', GitHub);

function GitHub(gitHubAuth, $http) {
  var url = 'https://api.github.com/repos/angular/angular.js';
  var self = this;

  this.getTags = function() {
    return $http.
        get(url + '/tags', {
          params: gitHubAuth
        }).
        then(function(response) {
          return response.data;
        });
  };

  this.getLatestTagStartingWith = function(startingWith) {
    return this.getTags().then(function(tags) {
      for (var i = 0, ii = tags.length; i < ii; i++) {
        var tag = tags[i];
        if (tag.name.indexOf(startingWith) == 0) {
          return tag.name;
        }
      }
      return null;
    });
  };

  this.getSHAsSince = function(branchName, sinceTag) {
    return $http.
        get(url + '/compare/' + sinceTag + '...' + branchName, {
          params: gitHubAuth
        }).
        then(function(response) {
          return response.data.ahead_by;
        });
  };

  this.getSHAsSinceSinceRelease = function(branchName) {
    var startingWithTag = (branchName == 'master')
        ? 'v1.2'
        : branchName.replace(/\.x$/, '');
    return this.
        getLatestTagStartingWith(startingWithTag).
        then(function(latestTag) {
          return self.getSHAsSince(branchName, latestTag);
        });
  };

  this.getMilestones = function() {
    return $http.
        get(url + '/milestones', {
          params: gitHubAuth
        }).
        then(function(response) {
          return response.data;
        });
  }

  this.getMilestoneId = function(name) {
    return this.getMilestones().then(function(milestones) {
      for (var i = 0, ii = milestones.length; i < ii; i++) {
        var milestone = milestones[i];
        if (milestone.title == name) {
          return milestone.id;
        }
      }
      return null;
    });
  };

  this.getWorkloadStats = function(milestone) {
    return getMilestoneId(milestone).
        then(function(milestoneId) {

        });
  };
}

