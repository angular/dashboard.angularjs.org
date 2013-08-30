'use strict';


app.controller('BranchStatusController', [
    '$scope', 'schedule', 'jenkins', 'github',
    'createBuildCard', 'createGoogle3Card', 'createShaCountCard',
    function BranchStatusController(
        $scope, schedule, jenkins, github,
        createBuildCard, createGoogle3Card, createShaCountCard) {

  var masterBuildCard = createBuildCard();
  var stableBuildCard = createBuildCard();
  var masterGoogle3Card = createGoogle3Card();
  var stableGoogle3Card = createGoogle3Card();
  var masterReleaseCard = createShaCountCard();
  var stableReleaseCard = createShaCountCard();

  $scope.branches = [{
    title: 'master',
    cards: [masterBuildCard, masterGoogle3Card, masterReleaseCard]
  }, {
    title: 'stable/1.0',
    cards: [stableBuildCard, stableGoogle3Card, stableReleaseCard]
  }];

  schedule.onceAMinute(function() {
    jenkins.buildStatus('angular.js-angular-master').then(function(buildStatus) {
      masterBuildCard.update(buildStatus.happy, buildStatus.since, buildStatus.author);
      $scope.$emit('dash:buildUpdate', 'master', buildStatus);
    });

    jenkins.buildStatus('angular.js-angular-v1.0.x').then(function(buildStatus) {
      stableBuildCard.update(buildStatus.happy, buildStatus.since, buildStatus.author);
      $scope.$emit('dash:buildUpdate', 'stable/1.0', buildStatus);
    });

    github.getSHAsSince('master', 'g3_v1_x').then(function(count) {
      masterGoogle3Card.update(count);
    });
    github.getSHAsSince('v1.0.x', 'g3_v1_0').then(function(count) {
      stableGoogle3Card.update(count);
    });

    github.getSHAsSinceRelease('master').then(function(count) {
      masterReleaseCard.update(count);
    });

    github.getSHAsSinceRelease('v1.0.x').then(function(count) {
      stableReleaseCard.update(count);
    })
  });
}]);
