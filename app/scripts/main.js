// He we import all the modules we need. This is the configuration place.
// Other parts of the code typically do not import any modules and rather fully rely
// on the DI (runtime dependencies).

// controllers
module mc from 'controllers/MainController';
module bsc from 'controllers/BranchStatusController';
module gsc from 'controllers/GithubStatusController';

// directives
module bmd from 'directives/bindMarkdownDirective';
module bdcd from 'directives/burnDownChart';
module cd from 'directives/cardDirective';
module pbd from 'directives/progressBarDirective';

// filters
module pdf from 'filters/prettyDateFilter';

// services
module ss from 'services/scheduleService';
module js from 'services/jenkinsService';
module gs from 'services/githubService';

// config
module dartConfig from 'config/dart';
module jsConfig from 'config/js';

// cards
module cards from 'factories/cards';


// Convert future DI module (ES6) to the current Angular DI module.
// This will be gone with the new DI.
import {ES6toDI} from 'utils';


// This is how you configure the app - by loading different modules.
var modules = [
  mc, bsc, gsc,
  bmd, bdcd, cd, pbd,
  ss, js, gs,
  cards,
  pdf
];


// Configuration = loading different modules.
// The main.js might be requested as main.js?config=dart and the code would be generated
// on the server.
// Because I don't think ES6 modules support conditional loading (imports/exports are static) and
// we don't wanna load all the config options to the client, but rather only the ones we need.
if (window.location.host.indexOf('angulardart') === -1) {
  modules.push(jsConfig);
} else {
  modules.push(dartConfig);
}


// Auto bootstrap through ng-app is gone.
angular.bootstrap(document.body, modules.map(ES6toDI));
