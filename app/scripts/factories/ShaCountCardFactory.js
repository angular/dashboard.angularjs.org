import {inherits} from '../utils';

createShaCountCard.$inject = ['createCard'];
createShaCountCard.$providerType = 'factory';

export function createShaCountCard(createCard) {
  var ShaCountCardViewModel = function(title, content, note, classes) {
    if (!(this instanceof ShaCountCardViewModel)) {
      return new ShaCountCardViewModel(title, content, note, classes);
    }

    createCard.call(this, 'there have been', null, 'shas since the last release',
        ['sha-count-card']);
  };

  inherits(ShaCountCardViewModel, createCard);

  ShaCountCardViewModel.prototype.update = function(count) {
    this.content = count;
  };

  return ShaCountCardViewModel;
}
