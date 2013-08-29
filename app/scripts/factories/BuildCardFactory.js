'use strict';


app.factory('createBuildCard', [
    'createCard', 'prettyDateFilter',
    function (createCard, prettyDateFilter) {
  var BuildCardViewModel = function(title, content, note, classes) {
    if (!(this instanceof BuildCardViewModel)) {
      return new BuildCardViewModel(title, content, note, classes);
    }

    createCard.call(this, 'build', null, null, ['build-card']);
  };

  app.inherits(BuildCardViewModel, createCard);

  BuildCardViewModel.prototype.update = function(passing, since) {
    if (passing) {
      this.content = 'ok';
      this.note = '*' + prettyDateFilter(new Date(since)) + '* since the last failure';
      this.classes[1] = 'build-card-ok';
    } else {
      this.content = 'broken';
      this.note = 'for the past *' + prettyDateFilter(new Date(since)) + '*';
      this.classes[1] = 'build-card-broken';
    }
  };

  return BuildCardViewModel;
}]);
