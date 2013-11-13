createCard.$inject = [];
createCard.$providerType = 'factory';

export function createCard() {
  var CardViewModel = function(title, content, note, classes, url) {
    if (!(this instanceof CardViewModel)) {
      return new CardViewModel(title, content, note, classes, url);
    }

    this.title = title;
    this.content = content;
    this.note = note;
    this.classes = classes;
    this.url = url;
  };

  return CardViewModel;
}
