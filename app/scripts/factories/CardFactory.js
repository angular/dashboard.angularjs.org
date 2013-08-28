'use strict';


app.factory('createCard', function () {
  var CardViewModel = function(title, content, note, classes) {
    if (!(this instanceof CardViewModel)) {
      return new CardViewModel(title, content, note, classes);
    }

    this.title = title;
    this.content = content;
    this.note = note;
    this.classes = classes;
  };

  return CardViewModel;
});
