'use strict';


app.factory('createGoogle3Card', [
    'createCard',
    function (createCard) {
  var Google3CardViewModel = function(title, content, note, classes) {
    if (!(this instanceof Google3CardViewModel)) {
      return new Google3CardViewModel(title, content, note, classes);
    }

    createCard.call(this, '*google*3', null, 'shas behind', ['google3-card']);
  };

  app.inherits(Google3CardViewModel, createCard);

  Google3CardViewModel.prototype.update = function(count) {
    this.content = count;

    if (count > 50) {
      this.classes[1] = 'google3-card-far-behind';
    } else {
      this.classes[1] = '';
    }
  };

  return Google3CardViewModel;
}]);
