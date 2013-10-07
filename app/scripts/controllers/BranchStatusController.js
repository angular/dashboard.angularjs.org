'use strict';


app.controller('BranchStatusController', [
    '$scope', 'schedule', 'jenkins', 'github',
    'createBuildCard', 'createGoogle3Card', 'createShaCountCard',
    function BranchStatusController(
        $scope, schedule, jenkins, github,
        createBuildCard, createGoogle3Card, createShaCountCard) {

  var masterBuildCard = createBuildCard();
  var masterGoogle3Card = createGoogle3Card();

  $scope.branches = [{
    title: 'master',
    cards: [masterBuildCard, masterGoogle3Card]
  }];

  schedule.onceAMinute(function() {
    jenkins.buildStatus('angular.dart-master').then(function(buildStatus) {
      masterBuildCard.update(buildStatus.happy, buildStatus.since, buildStatus.author);
      $scope.$emit('dash:buildUpdate', 'master', buildStatus);
    });

    github.getSHAsSince('master', 'g3v1x').then(function(count) {
      masterGoogle3Card.update(count);
    });
  });
}]);
