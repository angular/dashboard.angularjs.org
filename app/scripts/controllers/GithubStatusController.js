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
    github.getUntriagedCounts().then(function(counts) {
      untriagedPRsCard.update(counts.prs);
      untriagedIssuesCard.update(counts.issues);
    });

    github.getCountsForLatestMilestone().then(function(stats) {
      $scope.milestone.title = stats.milestone.title;
      milestonePRsCard.update(
        stats.openPrs, (stats.openPrs !== '?') ? stats.openPrs + stats.closedPrs : '?',
        stats.prHistory
      );
      milestoneIssuesCard.update(
        stats.openIssues, (stats.openIssues !== '?') ? stats.openIssues + stats.closedIssues : '?',
        stats.issueHistory);
      $scope.milestone.done = stats.closedPrs + stats.closedIssues;
      $scope.milestone.total = stats.openPrs + stats.closedPrs + stats.openIssues + stats.closedIssues;
    });

    github.getAllOpenCounts().then(function(counts) {
      totalPRsCard.update(counts.prs);
      totalIssuesCard.update(counts.issues);
    });
  });
}
