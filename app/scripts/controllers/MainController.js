'use strict';


app.controller('MainController', MainController);

function MainController($scope) {
  $scope.$on('dash:buildUpdate', function (e, branch, buildStatus) {
    if (buildStatus.happy && (!$scope.brokenBuild || $scope.brokenBuild.branch === branch)) {
      $scope.brokenBuild = null;
    } else {
      $scope.brokenBuild = {
        branch: branch,
        since: buildStatus.since
      };
    }
  });
}
