'use strict';

export default angular.module('app.gulpnoir.mainctrl', [])
  .controller(MainCtrl);

class MainController {
    constructor($http) {
        'ngInject';
        $http.get('google.com');
    }
}
