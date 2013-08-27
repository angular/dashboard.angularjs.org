'use strict';

var GithubCard = function(title, classes) {
  CardViewData.call(this, title, null, null, ['github-card'].join(classes));
};

GithubCard.prototype.update = function(count, total) {
  this.content = count;

  if (angular.isDefined(total)) {
    this.note = 'out of ' + total;
  }
};

app.controller('GithubStatusController', function GithubStatusController($scope, schedule, github) {
  var milestonePRsCard = new GithubCard('Pull requests', ['pr-card']);
  var milestoneIssuesCard = new GithubCard('Issues', ['issue-card']);
  var untriagedPRsCard = new GithubCard('Untriaged _Pull requests_', ['untriaged-card', 'pr-card', 'untriaged-pr-card']);
  var untriagedIssuesCard = new GithubCard('Untriaged _Issues_', ['untriaged-card', 'issue-card', 'untriaged-issue-card']);
  var totalPRsCard = new GithubCard('Total _Pull requests_', ['total-card', 'pr-card', 'total-pr-card']);
  var totalIssuesCard = new GithubCard('Total _Issues_', ['total-card', 'issue-card', 'total-issue-card']);

  $scope.milestone = {
    title: '1.2.0-RC2',
    total: 100,
    done: 50,
    cards: [milestonePRsCard, milestoneIssuesCard, untriagedPRsCard, untriagedIssuesCard],
    totalCards: [totalPRsCard, totalIssuesCard]
  };

  schedule.onceAMinute(function() {
    github.getUntriagedCounts().then(function(count) {
      untriagedPRsCard.update(count.prs);
      untriagedIssuesCard.update(count.issues);
    });
  });
});
