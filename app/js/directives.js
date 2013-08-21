angular.module('ngDashboard.directives', []).
  directive('google3Sync', function() {
    var EVERY_15_MINUTES = 15 * 60 * 1000;

    function numSHAsBehind(behindBranch, headBranch) {
      var behindSHAs = behindBranch.data;
      var headSHAs = headBranch.data;

      if (behindSHAs.length == 0) { return headSHAs.length; }

      var behindTopSHA = behindSHAs[0].sha;

      for (var i = 0, ii = headSHAs.length; i < ii; i++) {
        if (headSHAs[i].sha == behindTopSHA) {
          return i;
        }
      }
      return ii;
    }

    return {
      restrict: 'E',
      scope: {
        headBranch: '@',
        g3Branch: '@'
      },
      templateUrl: 'partials/google3-sync.html',
      replace: true,
      controller: ['$scope', 'GitCommits', 'Poll', function Google3SyncController($scope, GitCommits, Poll) {

        var masterData, g3BranchData;

        function computeSHAsBehind(scope, behindBranch, headBranch) {
          scope.numSHAsBehind = numSHAsBehind(behindBranch, headBranch);
        }

        var fetchData = function() {
          var masterData, g3BranchData;

          GitCommits.fetch({sha: $scope.g3Branch}, function(response) {
            if (masterData) {
              computeSHAsBehind($scope, response, masterData);
            } else {
              g3BranchData = response;
            }
          });

          GitCommits.fetch({sha: $scope.headBranch}, function(response) {
            if (g3BranchData) {
              computeSHAsBehind($scope, g3BranchData, response);
            } else {
              masterData = response;
            }
          });
        };

        Poll(fetchData, EVERY_15_MINUTES);
      }]
    }
  }
);