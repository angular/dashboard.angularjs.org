'use strict';

var GithubCard = function(title, classes) {
  CardViewData.call(this, title, null, null, ['github-card'].concat(classes));
};

GithubCard.prototype.update = function(count, total) {
  this.content = count;

  if (angular.isDefined(total)) {
    this.note = 'out of ' + total;
  }
};


var UntriagedCard = function (title, classes) {
  CardViewData.call(this, title, null, null, ['github-card', 'untriaged-card-none'].concat(classes));
};

UntriagedCard.prototype.update = function (count) {
  var index = this.classes.indexOf('untriaged-card-none');

  if (!count) {
    if (index === -1) {
      this.classes.push('untriaged-card-none');
    }
  } else {
    if (index !== -1) {
      this.classes.splice(index, 1);
    }
  }
};


app.controller('GithubStatusController', function GithubStatusController($scope, schedule, github) {
  var milestonePRsCard = new GithubCard('Pull requests', ['milestone-card', 'pr-card']);
  var milestoneIssuesCard = new GithubCard('Issues', ['milestone-card', 'issue-card']);
  var untriagedPRsCard = new UntriagedCard('Untriaged _Pull requests_', ['untriaged-card', 'pr-card', 'untriaged-pr-card']);
  var untriagedIssuesCard = new UntriagedCard('Untriaged _Issues_', ['untriaged-card', 'issue-card', 'untriaged-issue-card']);
  var totalPRsCard = new GithubCard('Total _Pull requests_', ['total-card', 'pr-card', 'total-pr-card']);
  var totalIssuesCard = new GithubCard('Total _Issues_', ['total-card', 'issue-card', 'total-issue-card']);

  $scope.milestone = {
    title: '1.2.0-RC2',
    total: 1,
    done: 0,
    cards: [milestonePRsCard, milestoneIssuesCard],
    totalCards: [totalPRsCard, totalIssuesCard, untriagedPRsCard, untriagedIssuesCard]
  };

  schedule.onceAMinute(function() {
    github.getUntriagedCounts().then(function(count) {
      untriagedPRsCard.update(count.prs);
      untriagedIssuesCard.update(count.issues);
    });

    github.getCountsForMilestone('1.2.0-rc2').then(function(stats) {
      milestonePRsCard.update(stats.openPrs, stats.openPrs + stats.closedPrs);
      milestoneIssuesCard.update(stats.openIssues, stats.openIssues + stats.closedIssues);
      $scope.milestone.done = stats.closedPrs + stats.closedIssues;
      $scope.milestone.total = stats.openPrs + stats.closedPrs + stats.openIssues + stats.closedIssues;
    });

    github.getAllOpenIssues().then(function(count) {
      totalPRsCard.update(count.prs);
      totalIssuesCard.update(count.issues);
    });
  });
});
