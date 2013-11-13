import {inherits} from '../utils';

createUntriagedCard.$inject = ['createCard'];
createUntriagedCard.$providerType = 'factory';

export function createUntriagedCard(createCard) {
  var UntriagedCardViewModel = function(title, classes) {
    if (!(this instanceof UntriagedCardViewModel)) {
      return new UntriagedCardViewModel(title, classes);
    }

    createCard.call(this, title, null, null,
        ['github-card', 'untriaged-card-none'].concat(classes));
  };

  inherits(UntriagedCardViewModel, createCard);

  UntriagedCardViewModel.prototype.update = function (count) {
    this.content = count;

    var index = this.classes.indexOf('untriaged-card-none');
    if (!count || count === '?') {
      if (index === -1) {
        this.classes.push('untriaged-card-none');
      }
    } else {
      if (index !== -1) {
        this.classes.splice(index, 1);
      }
    }
  };

  return UntriagedCardViewModel;
}
