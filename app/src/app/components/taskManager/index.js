import 'jointjs';
import 'jointjs/dist/joint.min.css';
import './_style.scss';

let taskManager = () => {
  return {
    template: require('./template.html'),
    controller: 'taskManagerCtrl',
    controllerAs: 'taskManagerCtrl'
  }
};

class taskManagerCtrl {
  constructor() {
    console.log("Tasks");
  }
}

angular.module('gulpnoir.component.taskManager', [])
  .directive('taskManager', taskManager)
  .controller('taskManagerCtrl', taskManagerCtrl);

export default 'gulpnoir.component.taskManager';
