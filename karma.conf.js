// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine', 'requirejs'],

    preprocessors: {
      'app/views/*.html': ['ng-html2js'],
      'app/scripts/**/*.js': ['es6-transpile']
    },

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      // 'app/scripts/app.js',
      {pattern: 'app/scripts/**/*.js', included: false},
      'app/views/*.html',
      'test/main.js'
      // 'test/spec/*/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
      'app/main.js'
    ],

    // web server port
    port: 8008,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    ngHtml2JsPreprocessor: {
      moduleName: 'dashboardApp',
      stripPrefix: 'app/'
    },

    // TODO(vojta): refactor this into a plugin
    plugins: ['karma-jasmine', 'karma-requirejs', 'karma-chrome-launcher', 'karma-ng-html2js-preprocessor', {
      'preprocessor:es6-transpile': ['factory', function(/* config.basePath */ basePath) {
        var Compiler = require('es6-module-transpiler').Compiler;
        return function(content, file, done) {
          var compiler = new Compiler(content, null);
          done(compiler.toAMD());
        };
      }]
    }]
  });
};
