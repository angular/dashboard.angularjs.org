'use strict';


var markdown = function(string) {
  return string.replace('/', '<span>/</span>')
               .replace('-', '<span>-</span>')
               .replace(/\*(.*)\*/, '<strong>$1</strong>')
               .replace(/_(.*)_/, '<span>$1</span>');
};

app.directive('bindMarkdown', function() {
  return function(scope, elm, attr) {
    scope.$watch(attr.bindMarkdown, function(value) {
      elm.html(value ? markdown(value) : '');
    });
  };
});
