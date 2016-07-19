import './_style.scss';

let taskBuilder = () => {
  return {
    template: require('./template.html'),
    controller: 'taskBuilderCtrl',
    controllerAs: 'taskBuilderCtrl'
  }
};

class taskBuilderCtrl {
  constructor() {
    console.log("Tasks");
  }
}

angular.module('gulpnoir.component.taskBuilder', [])
  .directive('taskBuilder', taskBuilder)
  .controller('taskBuilderCtrl', taskBuilderCtrl);

export default 'gulpnoir.component.taskBuilder';
