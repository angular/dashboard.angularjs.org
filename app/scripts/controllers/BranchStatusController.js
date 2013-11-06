'use strict';

app.controller('BranchStatusController', BranchStatusController);

BranchStatusController.$inject = [
    '$scope', 'schedule', 'config', 'jenkins', 'github',
    'createBuildCard', 'createGoogle3Card', 'createShaCountCard'
  ];
function BranchStatusController(
    $scope, schedule, config, jenkins, github,
    createBuildCard, createGoogle3Card, createShaCountCard) {
  var updators = [];
  schedule.onceAMinute(function() {
    angular.forEach(updators, function(updator) {
      updator();
    });
  });
  
  $scope.branches = [];
  angular.forEach(config.branches, function(branchConfig) {
    var buildCard = createBuildCard();
    var g3Card = createGoogle3Card();
    g3Card.url = 'https://github.com/angular/PROJECT/compare/G3NAME...GHNAME'
      .replace('PROJECT', config.githubProject)
      .replace('G3NAME', branchConfig.g3Name)
      .replace('GHNAME', branchConfig.name);
    var cards = [buildCard, g3Card];
    updators.push(function() {
      jenkins.buildStatus(branchConfig.jenkinsProjectId).then(function(buildStatus) {
        buildCard.update(buildStatus.happy, buildStatus.since, buildStatus.author);
        $scope.$emit('dash:buildUpdate', branchConfig.title, buildStatus);
      });
      github.getSHAsSince(branchConfig.name, branchConfig.g3Name).then(function(count) {
        g3Card.update(count);
      });
    });
    if (branchConfig.releaseTag) {
      var releaseCard = createShaCountCard();
      cards.push(releaseCard);
      updators.push(function() {
        github.getSHAsSinceRelease(
            branchConfig.name, branchConfig.releaseTag).then(function(count) {
          releaseCard.update(count);
        });
      });
    }
    $scope.branches.push({ title: branchConfig.title,
                           cards: cards });
  });
}
