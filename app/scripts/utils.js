var inherits = function (Child, Parent) {
  var Constructor = function () {};
  Constructor.prototype = Parent.prototype;

  Child.prototype = new Constructor();
  Child.prototype.constructor = Child;
};

// This helper/patch will be gone with the new DI.
var ES6toDI = function(m) {
  var angularModuleId = 'm' + Math.random();
  var angularModule = angular.module(angularModuleId, []);
  var provider;
  var providerType;
  var providerName;

  Object.keys(m).forEach(function(name) {
    provider = m[name];
    providerType = provider.$providerType;
    providerName = provider.$name || name;

    if (!providerType) {
      return;
    }

    switch (providerType) {
      case 'service':
        angularModule.service(providerName, provider);
        break;
      case 'controller':
        angularModule.controller(providerName, provider);
        break;
      case 'directive':
        angularModule.directive(providerName, provider);
        break;
      case 'value':
        angularModule.value(providerName, provider);
        break;
      case 'factory':
        angularModule.factory(providerName, provider);
        break;
      case 'filter':
        angularModule.filter(providerName, provider);
        break;
      default:
        throw new Error('Unimplemented provider type ' + provider.$providerType || 'service');
    }
  });

  return angularModuleId;
};

export { inherits, ES6toDI };
