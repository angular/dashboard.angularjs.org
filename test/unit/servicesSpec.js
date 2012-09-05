'use strict';

describe('Services', function() {
  beforeEach(module('ngDashboard.services'));

  describe('Poll', function() {
    var poll, timeout, callCount, callFn;
    beforeEach(inject(function(Poll, $timeout) {
      poll = Poll;
      timeout = $timeout;
      callCount = 0;
      callFn = function() {
        callCount++;
      };
    }));
    it('should call function immd and queue next', function() {
      expect(callCount).toEqual(0);
      poll(callFn, 1000);
      expect(callCount).toEqual(1);
    });
    it('should call function after interval', function() {
      poll(callFn, 1000);
      expect(callCount).toEqual(1);
      // Simulate time passed
      timeout.flush();
      expect(callCount).toEqual(2);
    });
    it('should keep calling function once per interval', function() {
      poll(callFn, 1000);
      // Simulate time passed
      timeout.flush();
      expect(callCount).toEqual(2);
      // Simulate time passed
      timeout.flush();
      expect(callCount).toEqual(3);
    });
  });
});
