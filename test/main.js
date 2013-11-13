var specFiles = [];
var TEST_REGEXP = /\.spec\.js$/;

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    specFiles.push(file.replace(/^\/base\//, '').replace(/\.js$/, ''));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  // dynamically load all test files
  deps: ['app/scripts/utils'].concat(specFiles),


  // we have to kick of jasmine, as it is asynchronous
  // callback: window.__karma__.start
  callback: function(utils) {
    // This hack will be gone with the new DI.
    var originalModule = window.module;
    window.module = function() {
      var args = Array.prototype.slice.call(arguments, 0).map(function(arg) {
        if (typeof arg !== 'object') {
          return arg;
        }

        return utils.ES6toDI(arg);
      });

      return originalModule.apply(null, args);
    };

    __karma__.start();
  }
});
