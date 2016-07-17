import angular from 'angular';
import pluginsList from './component.pluginsList';

require('../style/app.scss');

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
  pluginsList
])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl);

export default MODULE_NAME;
