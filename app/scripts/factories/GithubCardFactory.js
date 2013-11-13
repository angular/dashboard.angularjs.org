import {inherits} from '../utils';

createGithubCard.$providerType = 'factory';
createGithubCard.$inject = ['createCard'];

export function createGithubCard(createCard) {
  var GithubCardViewModel = function(title, classes) {
    if (!(this instanceof GithubCardViewModel)) {
      return new GithubCardViewModel(title, classes);
    }

    createCard.call(this, title, null, null, ['github-card'].concat(classes));
  };

  inherits(GithubCardViewModel, createCard);

  GithubCardViewModel.prototype.update = function(count, total, burnDown) {
    this.content = count;

    if (angular.isDefined(total)) {
      this.note = 'out of *' + total + '*';
    }
    if (burnDown) {
      this.burnDown = burnDown;
    }
  };

  return GithubCardViewModel;
}
