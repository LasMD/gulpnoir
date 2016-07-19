import 'angular-material/angular-material.scss';
import './app.scss';

import angular from 'angular';
import angularMaterial from 'angular-material';
import { pluginsList, taskManager } from './components';

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

class AppCtrl {
  constructor() {

  }
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [
  angularMaterial,
  pluginsList,
  taskManager
])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl);

export default MODULE_NAME;
