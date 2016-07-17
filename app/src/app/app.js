import angular from 'angular';

import '../style/app.css';

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

@Inject('$http')
class AppCtrl {
  constructor($http) {
    $http.get('http://npmsearch.com/query?fields=name,keywords,rating,description,author,modified,homepage,version&q=keywords:gulpfriendly&q=keywords:gulpplugin&size=2756&sort=rating:desc')
    .then((success) => {
      this.results = success.data.results.map((result) => {
        return {
          name: result.name[0]
        };
      });
    }, (error) => {
      console.log(success);
    });
  }
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl);

export default MODULE_NAME;
