let pluginsList = () => {
  return {
    template: require('./template.html'),
    controller: 'pluginsListCtrl',
    controllerAs: 'ctrl'
  }
};

@Inject('$http')
class pluginsListCtrl {
  constructor($http) {
    $http.get('http://npmsearch.com/query?fields=name,keywords,rating,description,author,modified,homepage,version&q=keywords:gulpfriendly&q=keywords:gulpplugin&size=2756&sort=rating:desc')
    .then((success) => {
      this.results = success.data.results.map((result) => {
        return {
          name: result.name[0],
          description: result.description[0],
          keywords: result.keywords,
          version: result.version[0]
        };
      });
    }, (error) => {
      console.log(success);
    });
  }
}


angular.module('gulpnoir.component.pluginsList', [])
  .directive('pluginsList', pluginsList)
  .controller('pluginsListCtrl', pluginsListCtrl);

export default 'gulpnoir.component.pluginsList';
