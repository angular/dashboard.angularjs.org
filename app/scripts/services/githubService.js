'use strict';

/* jshint camelcase: false */

angular.module('github', ['config'])

.value('githubAuth', {
  client_id: localStorage.getItem('github.client_id'),
  client_secret: localStorage.getItem('github.client_secret')
})


.factory('github', ['githubAuth', 'requestWithLocalCache', 'config', 'ItemCollection',
      function Github(githubAuth, requestWithLocalCache, config, ItemCollection) {

  function isGhIssueAPr(item) {
    return item.pull_request && item.pull_request.diff_url;
  }

  var url = 'https://api.github.com/repos/angular/' + config.githubProject;

  return {

    /**
     * Get the tag name for the most recent release on the given branch
     * @param  { { releaseTag: string } } branch
     * An object specifying the prefix for this branch's release tags
     * @return {string=}
     * The tag of the latest release for the given branch (or null if none)
     */
    getLatestRelease: function(branch) {

      function getFirstMatch(data) {
        for (var i = 0, ii = data.length; i < ii; i++) {
          var tag = data[i];
          if (tag.name.indexOf(branch.releaseTag) === 0) {
            return tag.name;
          }
        }
        return null;
      }

      return requestWithLocalCache(url + '/tags', 'github:getLatestRelease:'+branch.releaseTag, getFirstMatch);
    },


    /**
     * Count the number of commits between two tree-ish git references
     * @param  {string} from The tree-ish (branch, tag or commit) to start from
     * @param  {string} to   The tree-ish (branch, tag or commit) to end at
     * @return {number}       The number of commits between the two tree-ish references
     */
    countSHAs: function(from, to) {

      function getCount(data) {
        return data.ahead_by;
      }

      return requestWithLocalCache(url + '/compare/' + to + '...' + from, 'github:countSHAs:' + from + ':' + to, getCount);
    },


    /**
     * Get information about the latest milestone for this repository
     * @return {Object} An object containing the milestone information
     */
    getLatestMilestone: function() {

      function getFirst(data) {
        return data[0];
      }

      var params = {
        state: 'open',
        sort: 'due_date',
        direction: 'desc'
      };

      return requestWithLocalCache(url + '/milestones', 'github:getLatestMilestone', getFirst, params);
    },


    /**
     * Get an object containing count information about issues in the repository
     * @param  {string=} state
     * If given filter the issues by state (open/closed)
     * @param  {Object|null|undefined} milestone
     * If `null` then get issue with no milestone;
     * If `undefined` get issues for any milestone;
     * Othewise get issue with milestone given by `milestone.number`
     * @return {{ prs: ItemCollection, issues: ItemCollection }
     * An object containing a collection of count information for the issues
     * and pull requests
     */
    getIssueCounts: function(milestone, state) {

      var milestoneNumber = angular.isObject(milestone) ?
        milestone.number : milestone;

      function createCountCollection(data) {
        var prs = new ItemCollection();
        var issues = new ItemCollection();

        angular.forEach(data, function(item) {
          if ( isGhIssueAPr(item) ) {
            prs.addItem(item);
          } else {
            issues.addItem(item);
          }
        });

        return { prs: prs, issues: issues };
      }

      var params = {};

      params.state = state || 'all';
      if ( milestoneNumber ) { params.milestone = milestoneNumber; }

      return requestWithLocalCache(url + '/issues', 'github:getCountsFor:'+state+':'+milestoneNumber, createCountCollection, params);
    }

  };

}])


.factory('getAllPages', ['$http', function($http) {
  return function getAllPages(request) {

    return $http(request).then(function(response) {
      var nextPageUrlRegExp = /<([^>]+)>; rel="next"/;
      var nextPageUrl = nextPageUrlRegExp.test(response.headers('Link')) &&
                          nextPageUrlRegExp.exec(response.headers('Link'))[1];
      if (nextPageUrl) {
        request = angular.copy(request);
        request.url = nextPageUrl;
        return getAllPages(request).then(function(nextPageResponse) {
          // Add the previous data pages to the current page
          nextPageResponse.data = response.data.concat(nextPageResponse.data);
          return nextPageResponse;
        });
      } else {
        return response;
      }
    });
  };

}])


.factory('requestWithLocalCache', ['getAllPages', 'githubAuth', function(getAllPages, githubAuth) {

  function parseDateReviver(k,v) {
    return (k === 'date') ? new Date(v) : v;
  }

  return function(url, cacheKey, transform, params) {

    params = angular.extend({per_page:100}, params, githubAuth);
    transform = transform || angular.identity;

    return getAllPages({ method: 'GET', url: url, params: params })
      .then(
        function success(response) {
          var data = transform(response.data);
          localStorage[cacheKey] = JSON.stringify(data);
          return data;
        },
        function error() {
          return JSON.parse(localStorage[cacheKey] || '"-"', parseDateReviver);
        }
      );
  };

}])


.factory('ItemCollection', function() {
  function ItemCollection() {
    this.openCount = 0;
    this.closedCount = 0;
    this.itemHistory = [];
  }

  ItemCollection.prototype.addItem = function(item) {
      var milestoneCreateDate = item.milestone ? new Date(item.milestone.created_at) : null;
      var createDate = new Date(item.created_at);

      // Add when this item was opened
      this.itemHistory.push({
        date: milestoneCreateDate > createDate ? milestoneCreateDate : createDate,
        state: 'open'
      });

      if ( item.state === 'closed' ) {
        this.closedCount++;
        this.itemHistory.push({
          date: new Date(item.closed_at),
          state: 'closed'
        });
      } else {
        this.openCount++;
      }
  };
  return ItemCollection;
});