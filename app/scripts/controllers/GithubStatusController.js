'use strict';


app.controller('GithubStatusController', function GithubStatusController($scope) {
  $scope.milestone = {
    title: '1.2.0-RC2',
    cards: [
      new CardViewData('Pull requests', '5', 'out of 41', ['github-card', 'pr-card']),
      new CardViewData('Issues', '48', 'out of 230', ['github-card', 'issue-card']),
      new CardViewData('Untriaged _Pull requests_', '2', null, ['github-card', 'untriaged-card', 'pr-card', 'untriaged-pr-card']),
      new CardViewData('Untriaged _Issues_', '31', null, ['github-card', 'untriaged-card', 'issue-card', 'untriaged-issue-card'])
    ],

    totalCards: [
      new CardViewData('Total _Pull requests_', '81', null, ['github-card', 'total-card', 'pr-card', 'total-pr-card']),
      new CardViewData('Total _Issues_', '420', null, ['github-card', 'total-card', 'issue-card', 'total-issue-card'])
    ]
  };
});
