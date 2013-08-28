'use strict';

angular.module('dashboardApp')
  .directive('dashGraph', function () {

    var SVG_WIDTH = 500,
      SVG_HEIGHT = 300;

    return {
      template:
        '<svg viewBox="0 0 ' + SVG_WIDTH + ' ' + SVG_HEIGHT + '">' +
          '<path class="graph-sparkline"></path>' +
        '</svg>',
      restrict: 'E',
      scope: {
        data: '=dashGraphModel'
      },
      terminal: true,
      link: function postLink(scope, element, attrs) {

        var path = element.children().children();
        console.log(path);

        scope.$watch('data', renderPath);

        var xScale,
          yScale;

        function makeIncomprehensibleSvgPathString (data) {
          var max = getDataMax(data);

          xScale = SVG_WIDTH / data.length;
          yScale = SVG_HEIGHT / max;


          return 'M' + makeSvgPoint(max, 0) +
            data.
              map(function (item) {
                return max - item;
              }).
              map(function (item, index) {
                return 'L' + makeSvgPoint(item, index+1);
              }).
              join('') +
            'L' + makeSvgPoint(max, data.length) + 'Z';
        }

        function makeSvgPoint (item, index) {
          return (xScale*index) + ',' + (yScale*item);
        }

        function getDataMax (items) {
          return Math.max.apply(Math, items);
        }

        function renderPath (data) {
          if (data) {
            path.attr('d', makeIncomprehensibleSvgPathString(data));
          }
        }
      }
    };
  });
