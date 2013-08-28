'use strict';


app.factory('createGithubCard', function (createCard) {
  var GithubCardViewModel = function(title, content, note, classes) {
    if (!(this instanceof GithubCardViewModel)) {
      return new GithubCardViewModel(title, content, note, classes);
    }

    createCard.call(this, title, null, null, ['github-card'].concat(classes));
  };

  app.inherits(GithubCardViewModel, createCard);

  GithubCardViewModel.prototype.update = function(count, total) {
    this.content = count;

    if (angular.isDefined(total)) {
      this.note = 'out of *' + total + '*';
    }
  };

  return GithubCardViewModel;
});
