'use strict';

/* Services */

angular.module('ngDashboard.services', ['ngResource']).
    factory('Twitter', function($resource) {
      return $resource('http://search.twitter.com/search.json',
          {callback: 'JSON_CALLBACK'}, {
            search: {
              method:'JSONP',
              params: {
                q:'angular.js AngularJS',
                result_type: 'recent',
                rpp: 25
              },
              isArray:false
            }
          });
    }).
    factory('GPlus', function($resource) {
      return $resource('https://www.googleapis.com/plus/v1/activities',
          {callback: 'JSON_CALLBACK'}, {
            search: {
              method:'JSONP',
              params:{
                query:'angular.js AngularJS',
                maxResults: 20,
                key: 'AIzaSyDT6UOJ1M9CgEz9IWVwxYH89PHldGm_uJo',
                orderBy: 'recent'
              },
              isArray:false
            }
          });
    }).
    factory('GitIssues', function($resource) {
      return $resource('https://api.github.com/repos/angular/angular.js/issues',
          {callback: 'JSON_CALLBACK'}, {
            list: {
              method:'JSONP',
              params:{
                milestone: '*',
                state: 'open',
                sort: 'created',
                direction: 'desc',
                per_page: 20
              },
              isArray: false
            }
          });
    }).
    factory('GitPullRequests', function($resource) {
      return $resource('https://api.github.com/repos/angular/angular.js/pulls',
          {callback: 'JSON_CALLBACK'}, {
            list: {
              method:'JSONP',
              params:{
                state: 'open',
                per_page: 100
              },
              isArray: false
            }
          });
    }).
    factory('GitRepo', function($resource) {
      return $resource('https://api.github.com/repos/angular/angular.js',
          {callback: 'JSON_CALLBACK'}, {
            fetch: {
              method:'JSONP',
              isArray: false
            }
          });
    }).
    factory('CIBuildStatus', function($resource) {
      return $resource('http://ci.angularjs.org/job/:buildname/api/json',
          {jsonp: 'JSON_CALLBACK'}, {
            fetch: {
              method:'JSONP',
              isArray: false
            }
          });
    }).factory('CIQueueStatus', function($resource) {
      return $resource('http://ci.angularjs.org/queue/api/json',
          {jsonp: 'JSON_CALLBACK'}, {
            fetch: {
              method:'JSONP',
              isArray: false
            }
          });
    }).factory('MailingList', function($resource) {
      return $resource('http://pipes.yahoo.com/pipes/pipe.run',
          {
            '_callback': 'JSON_CALLBACK',
            '_render' : 'json',
            '_id': 'eb2f12001ea44da6df729515f2de587c'
          }, {
            fetch: {
              method:'JSONP',
              isArray: false
            }
          });
    }).factory('CarouselController', function() {
      return function(elementId) {
        return {
          init: function(optIntervalInMs) {
            optIntervalInMs = optIntervalInMs || 7000;
            $(elementId).carousel({interval: optIntervalInMs});
          },
          perform: function(state) {
            $(elementId).carousel(state);
          }
        };

      };
    }).factory('Poll', function($timeout) {
      return function(pollFn, interval) {
        var callAndDefer = function() {
          pollFn();
          $timeout(callAndDefer, interval);
        }
        callAndDefer();
      };
    });
