import './_style.scss';

let componentSkeleton = () => {
  return {
    template: require('./template.html'),
    controller: 'componentSkeletonCtrl',
    controllerAs: 'componentSkeletonCtrl'
  }
};

class componentSkeletonCtrl {
  constructor() {
    console.log("Tasks");
  }
}

angular.module('gulpnoir.component.componentSkeleton', [])
  .directive('componentSkeleton', componentSkeleton)
  .controller('componentSkeletonCtrl', componentSkeletonCtrl);

export default 'gulpnoir.component.componentSkeleton';
