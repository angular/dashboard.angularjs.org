'use strict';

angular.module('dashboardApp').directive('burnDown', function () {

  return {
    template: '<svg class="bd-chart">' +
      '<path class="line total"></path>' +
      '<path class="line open"></path>' +
      '</svg>',
    restrict: 'E',
    scope: {
      data: '=burnDownModel'
    },
    link: function postLink(scope, element, attrs) {
      var svgElement = element.children()[0];
      var rect = svgElement.getBoundingClientRect();
      var width = rect.right - rect.left;
      var height = rect.bottom - rect.top;
      var xScale, yScale;
      var openLine = line(openAccessor);
      var totalLine = line(totalAccessor);

      var chart = d3.select(svgElement);

      scope.$watch('data', renderChart);

      function renderChart(data) {
        data = orderedSum(data);
        xScale = d3.time.scale()
          .range([0, width])
          .domain(d3.extent(data, dateAccessor));
        yScale = d3.scale.linear()
          .range([height, 0])
          .domain([0, d3.max(data, totalAccessor)]);

        drawPath(chart.select('.total'), totalLine, data);
        drawPath(chart.select('.open'), openLine, data);
      }

      function orderedSum(data) {
        var openCount = 0,
          totalCount = 0,
          result = [];
        data.sort(orderByDate).forEach(function (entry) {
          if (entry.state === "closed") {
            openCount--;
          } else {
            openCount++;
            totalCount++;
          }
          result.push({
            open: openCount,
            total: totalCount,
            date: entry.date
          });
        });
        return result;

        function orderByDate(a, b) {
          if (a.date > b.date) return 1;
          if (a.date < b.date) return -1;
          return 0;
        }
      }

      function drawPath(path, line, data) {
        // stroke-dasharray and stroke-dashoffset is for animation only.
        var totalLength = path.node().getTotalLength();
        path.attr("stroke-dasharray", totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(2000)
          .ease("linear")
          .attr("stroke-dashoffset", 0);
        path.attr("d", line(data));
      }

      function line(accessor) {
        return d3.svg.line()
          .x(function (d) {
            return xScale(dateAccessor(d));
          })
          .y(function (d) {
            return yScale(accessor(d));
          });
      }

      function dateAccessor(d) {
        return d.date;
      }

      function totalAccessor(d) {
        return d.total;
      }

      function openAccessor(d) {
        return d.open;
      }
    }
  };
});
