var card = function() {
  return {
    restrict: 'E',
    templateUrl: 'views/card.html',
    scope: {
      'data': '=cardData'
    }
  };
};

card.$providerType = 'directive';

export {card};
