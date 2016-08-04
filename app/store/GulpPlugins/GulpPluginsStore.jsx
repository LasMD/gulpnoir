import { ReduceStore } from 'flux/utils';
import GulpPluginsDispatcher, { GulpPluginsDispatch } from './GulpPluginsDispatcher';
import Immutable from 'immutable';
import GulpPlugin from './GulpPlugin';
import $ from 'jquery';

class GulpPluginsStore extends ReduceStore {

  getInitialState() {
    $.get('http://npmsearch.com/query?fields=name,keywords,rating,description,author,modified,homepage,version&q=keywords:gulpfriendly&q=keywords:gulpplugin&size=20&sort=rating:desc',
    (result) => {
      let jsonResult = JSON.parse(result);
      GulpPluginsDispatch({
        type: 'plugins/set',
        gulpPlugins: jsonResult
      });
    });
    return Immutable.Map().set('installed', Immutable.Map());
  }

  reduce(state, action) {
    switch (action.type) {
      case 'plugins/set': {
        return state.set('plugins', action.gulpPlugins.results);
      }
      case 'plugins/install': {
        return state.set('installed',
          state.get('installed').set(action.plugin.name, action.plugin)
        );
      }
      default:
        return state;
    }
  }

  getInstalledPlugins() {
    return this.getState().get('installed');
  }

  getGulpPlugins() {
    return this.getState().get('plugins') || [];
  }

}

const instance = new GulpPluginsStore(GulpPluginsDispatcher);
export default instance;
