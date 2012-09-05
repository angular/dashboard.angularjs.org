'use strict';

/* jasmine specs for filters go here */

describe('filter', function() {
  beforeEach(module('ngDashboard.filters'));


  describe('sinceTime', function() {
    var sinceTime, origTimeInMs;
    beforeEach(inject(function($filter) {
      sinceTime = $filter('sinceTime');
      origTimeInMs = 10000 * 1000;
    }));

    it('should respond correctly for seconds', inject(function($filter) {
      expect(sinceTime(origTimeInMs, origTimeInMs + 45 * 1000)).toEqual('45 seconds');
      expect(sinceTime(origTimeInMs, origTimeInMs + 45 * 1000 + 450)).toEqual('45 seconds');
      expect(sinceTime(origTimeInMs, origTimeInMs + 45 * 1000 + 750)).toEqual('46 seconds');
    }));

    it('should respond correctly for minutes', inject(function($filter) {
      expect(sinceTime(origTimeInMs, origTimeInMs + 63 * 1000)).toEqual('1 minutes');
      expect(sinceTime(origTimeInMs, origTimeInMs + 125 * 1000)).toEqual('2 minutes');
      expect(sinceTime(origTimeInMs, origTimeInMs + 160 * 1000)).toEqual('3 minutes');
    }));

    it('should respond correctly for hours', inject(function($filter) {
      expect(sinceTime(origTimeInMs, origTimeInMs + 3 * 60 * 60 * 1000)).toEqual('3 hours');
      expect(sinceTime(origTimeInMs, origTimeInMs + 3 * 60 * 60 * 1000 + 23 * 60 * 1000)).toEqual('3 hours');
      expect(sinceTime(origTimeInMs, origTimeInMs + 3 * 60 * 60 * 1000 + 48 * 60 * 1000)).toEqual('4 hours');
    }));

    it('should respond correctly for days', inject(function($filter) {
      expect(sinceTime(origTimeInMs, origTimeInMs + 2 * 24 * 60 * 60 * 1000)).toEqual('2 days');
      expect(sinceTime(origTimeInMs, origTimeInMs + 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000)).toEqual('2 days');
      expect(sinceTime(origTimeInMs, origTimeInMs + 2 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000)).toEqual('3 days');
    }));
  });
});
