'use strict';

angular.module('dashboardApp')
  .directive('dashFlip', function ($window) {
    return {
      template: '<div ng-transclude></div>',
      restrict: 'E',
      transclude: true,
      link: function postLink(scope, element, attrs) {

        var transcludedChildElts = element.children().children();

        var states = [];
        angular.forEach(transcludedChildElts, function (elt) {
          states.push(angular.element(elt));
        });

        transcludedChildElts.addClass('dash-flipable');

        var active, activeIndex = 0;

        var intervalId = $window.setInterval(displayNext, 3000);
        scope.$on('$destroy', function () {
          $window.clearInterval(intervalId);
        });

        displayNext();

        function displayNext () {
          hideActive();
          active = states[activeIndex];
          active.addClass('dash-flip-active');
          activeIndex = (activeIndex + 1) % states.length;
        }

        function hideActive () {
          if (active) {
            active.removeClass('dash-flip-active');
          }
        }
      }
    };
  });
