'use strict';


app.controller('MainController', MainController);

function MainController($scope, $timeout) {
  $scope.brokenBuild = null;
  $scope.fixedBuild = null;

  var fixedBuildPromise;

  $scope.$on('dash:buildUpdate', function (e, branch, buildStatus) {
    if (buildStatus.happy && $scope.brokenBuild && $scope.brokenBuild.branch === branch) {
      $scope.fixedBuild = {
        branch: branch,
        author: buildStatus.author
      };
      $scope.brokenBuild = null;

      fixedBuildPromise = $timeout(function () {
        $scope.fixedBuild = null;
        fixedBuildPromise = null;
      }, 5000);

    } else if (!buildStatus.happy) {
      $scope.brokenBuild = {
        branch: branch,
        author: buildStatus.author,
        since: buildStatus.since
      };
      $scope.fixedBuild = null;

      if (fixedBuildPromise) {
        $timeout.cancel(fixedBuildPromise);
      }
    }
  });
}

MainController.$inject = ['$scope', '$timeout'];
