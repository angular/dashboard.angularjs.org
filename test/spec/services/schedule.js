'use strict';

describe('Service: schedule', function () {

  // load the service's module
  beforeEach(module('dashboardApp'));

  // instantiate service
  var schedule;
  beforeEach(inject(function (_schedule_) {
    schedule = _schedule_;
  }));

  it('should schedule a task execution', function () {
    schedule.onceAMinute(function() {});
  });

});
