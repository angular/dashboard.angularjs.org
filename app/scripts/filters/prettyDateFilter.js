'use strict';


app.filter('prettyDate', function () {
  return function (date) {
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
});
