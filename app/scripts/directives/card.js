'use strict';


var app = angular.module('dashboardApp');


var CardViewData = function(title, content, note, classes) {
  this.title = title;
  this.content = content;
  this.note = note;
  this.classes = classes;
};


app.directive('card', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/card.html',
    scope: {
      'data': '=cardData'
    }
  };
});
