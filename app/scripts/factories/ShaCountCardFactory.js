'use strict';


app.factory('createShaCountCard', [
    'createCard',
    function (createCard) {
  var ShaCountCardViewModel = function(title, content, note, classes) {
    if (!(this instanceof ShaCountCardViewModel)) {
      return new ShaCountCardViewModel(title, content, note, classes);
    }

    createCard.call(this, 'there have been', null, 'shas since the last release',
        ['sha-count-card']);
  };

  app.inherits(ShaCountCardViewModel, createCard);

  ShaCountCardViewModel.prototype.update = function(count) {
    this.content = count;
  };

  return ShaCountCardViewModel;
}]);
