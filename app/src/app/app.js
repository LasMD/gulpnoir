import 'angular-material/angular-material.scss';
import '../style/app.scss';

import angular from 'angular';
import angularMaterial from 'angular-material';
import pluginsList from './component.pluginsList';

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
  pluginsList
])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl);

export default MODULE_NAME;
