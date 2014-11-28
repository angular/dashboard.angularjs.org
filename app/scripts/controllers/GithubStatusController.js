'use strict';

app.controller('GithubStatusController', GithubStatusController);

GithubStatusController.$inject = [
    '$scope', 'schedule', 'config', 'github', 'createGithubCard',
    'createUntriagedCard'
  ];
function GithubStatusController($scope, schedule, config, github,
                                createGithubCard, createUntriagedCard) {
  var milestonePRsCard = createGithubCard('Pull requests', ['milestone-card', 'pr-card']);
  var milestoneIssuesCard = createGithubCard('Issues', ['milestone-card', 'issue-card']);
  var untriagedPRsCard = createUntriagedCard('Untriaged _Pull requests_', ['untriaged-card', 'pr-card', 'untriaged-pr-card']);
  var untriagedIssuesCard = createUntriagedCard('Untriaged _Issues_', ['untriaged-card', 'issue-card', 'untriaged-issue-card']);
  var totalPRsCard = createGithubCard('Total _Pull requests_', ['total-card', 'pr-card', 'total-pr-card']);
  var totalIssuesCard = createGithubCard('Total _Issues_', ['total-card', 'issue-card', 'total-issue-card']);

  $scope.milestone = {
    title: '?',
    total: 1,
    done: 0,
    cards: [milestonePRsCard, milestoneIssuesCard],
    totalCards: [totalPRsCard, totalIssuesCard, untriagedPRsCard, untriagedIssuesCard]
  };

  schedule.onceAMinute(function() {
    github.getIssueCounts('none', 'open').then(function(counts) {
      untriagedPRsCard.update(counts.prs.openCount);
      untriagedIssuesCard.update(counts.issues.openCount);
    });

    github.getLatestMilestone()
      .then(function(milestone) {
        $scope.milestone.title = milestone.title;
        return github.getIssueCounts(milestone);
      })
      .then(function(counts) {
        milestonePRsCard.update(
          counts.prs.openCount,
          counts.prs.openCount + counts.prs.closedCount,
          counts.prs.itemHistory
        );

        milestoneIssuesCard.update(
          counts.issues.openCount,
          counts.issues.openCount + counts.issues.closedCount,
          counts.issues.itemHistory
        );

        $scope.milestone.done = counts.prs.closedCount + counts.issues.closedCount;
        $scope.milestone.total = counts.prs.closedCount + counts.issues.closedCount + counts.prs.openCount + counts.issues.openCount;
      });

    github.getIssueCounts(undefined, 'open').then(function(counts) {
      totalPRsCard.update(counts.prs.openCount);
      totalIssuesCard.update(counts.issues.openCount);
    });
  });
}
