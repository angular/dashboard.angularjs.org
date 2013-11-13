// will be
// @serviceProvider('$schedule')
// @inject('$timeout')
Schedule.$providerType = 'service';
Schedule.$inject = ['$timeout'];
Schedule.$name = 'schedule';

function Schedule($timeout) {
  this.onceAMinute = function(task) {
    $timeout(function repeat() {
      task();
      $timeout(repeat, 60*1000);
    }, 0);
  };
}

export {Schedule};
