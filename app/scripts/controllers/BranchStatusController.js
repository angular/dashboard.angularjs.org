'use strict';


// Based on http://ejohn.org/blog/javascript-pretty-date/
/*
 * JavaScript Pretty Date
 * Copyright (c) 2011 John Resig (ejohn.org)
 * Licensed under the MIT and GPL licenses.
 */
var prettyDate = function (date) {
  var diff = (((new Date()).getTime() - date.getTime()) / 1000),
    day_diff = Math.floor(diff / 86400);

  if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
    return;

  return day_diff == 0 && (
      diff < 60 && "a few seconds" ||
      diff < 120 && "1 minute" ||
      diff < 3600 && Math.floor( diff / 60 ) + " minutes" ||
      diff < 7200 && "1 hour" ||
      diff < 86400 && Math.floor( diff / 3600 ) + " hours") ||
    day_diff == 1 && "1 day" ||
    day_diff < 7 && day_diff + " days" ||
    day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks";
};


var BuildCard = function() {
  CardViewData.call(this, 'build', null, null, ['build-card']);
};

BuildCard.prototype.update = function(passing, since) {
  if (passing) {
    this.content = 'ok';
    this.note = '*' + prettyDate(new Date(since)) + '* since the last failure';
    this.classes[1] = 'build-card-ok';
  } else {
    this.content = 'broken';
    this.note = 'for the past *' + prettyDate(new Date(since)) + '*';
    this.classes[1] = 'build-card-broken';
  }
};


var Google3Card = function() {
  CardViewData.call(this, '*google*3', null, 'shas behind', ['google3-card']);
};

Google3Card.prototype.update = function(count) {
  this.content = count;

  if (count > 50) {
    this.classes[1] = 'google3-card-far-behind';
  } else {
    this.classes[1] = '';
  }
};


var ShaCountCard = function() {
  CardViewData.call(this, 'there have been', null, 'shas since the last release', ['sha-count-card']);
};

ShaCountCard.prototype.update = function(count) {
  this.content = count;
};


app.controller('BranchStatusController', function BranchStatusController($scope, schedule, jenkins, github) {
  var masterBuildCard = new BuildCard();
  var stableBuildCard = new BuildCard();
  var masterGoogle3Card = new Google3Card();
  var stableGoogle3Card = new Google3Card();
  var masterReleaseCard = new ShaCountCard();
  var stableReleaseCard = new ShaCountCard();

  $scope.branches = [{
    title: 'master',
    cards: [masterBuildCard, masterGoogle3Card, masterReleaseCard]
  }, {
    title: 'stable/1.0',
    cards: [stableBuildCard, stableGoogle3Card, stableReleaseCard]
  }];

  schedule.onceAMinute(function() {
    jenkins.buildStatus('angular.js-angular-master').then(function(buildStatus) {
      masterBuildCard.update(buildStatus.happy, buildStatus.since);
    });

    jenkins.buildStatus('angular.js-angular-v1.0.x').then(function(buildStatus) {
      stableBuildCard.update(buildStatus.happy, buildStatus.since);
    });

    github.getSHAsSince('master', 'g3_v1_x').then(function(count) {
      masterGoogle3Card.update(count);
    });
    github.getSHAsSince('v1.0.x', 'g3_v1_0').then(function(count) {
      stableGoogle3Card.update(count);
    });

    github.getSHAsSinceSinceRelease('master').then(function(count) {
      masterReleaseCard.update(count);
    });

    github.getSHAsSinceSinceRelease('v1.0.x').then(function(count) {
      stableReleaseCard.update(count);
    })
  });
});
