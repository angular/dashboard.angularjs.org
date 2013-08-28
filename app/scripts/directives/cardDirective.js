'use strict';


app.directive('card', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/card.html',
    scope: {
      'data': '=cardData'
    }
  };
});
