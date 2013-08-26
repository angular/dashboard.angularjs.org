'use strict';


var GithubStatusController = function($scope) {
  $scope.milestone = {
    title: '1.2.0-RC2',
    cards: [
      new CardViewData('Pull requests', '5', 'out of 41', ['github-card', 'pr-card']),
      new CardViewData('Pull requests', '5', 'out of 41', ['github-card', 'issue-card']),
      new CardViewData('Pull requests', '5', 'out of 41', ['github-card', 'untriaged-card', 'pr-card', 'untriaged-pr-card']),
      new CardViewData('Pull requests', '5', 'out of 41', ['github-card', 'untriaged-card', 'issue-card', 'untriaged-issue-card'])
    ],

    totalCards: [
      new CardViewData('Total Pull requests', '5', 'out of 41', ['github-card', 'total-card', 'pr-card', 'total-pr-card']),
      new CardViewData('Total Pull requests', '5', 'out of 41', ['github-card', 'total-card', 'issue-card', 'total-issue-card'])
    ]
  };
};
