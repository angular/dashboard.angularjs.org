'use strict';

var app = angular.module('dashboardApp', ['github']);

app.inherits = function (Child, Parent) {
  var Constructor = function () {};
  Constructor.prototype = Parent.prototype;

  Child.prototype = new Constructor();
  Child.prototype.constructor = Child;
};
