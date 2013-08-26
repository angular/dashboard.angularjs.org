var app = angular.module('dashboardApp');

app.directive('bindMarkdown', function() {
  var markdown = function(string) {
    return string.replace('/', '<span>/</span>')
                 .replace('-', '<span>-</span>')
                 .replace(/\*(.*)\*/, '<strong>$1</strong>')
                 .replace(/_(.*)_/, '<span>$1</span>');


  };

  return function(scope, elm, attr) {
    scope.$watch(attr.bindMarkdown, function(value) {
      elm.html(markdown(value));
    });
  };
});
