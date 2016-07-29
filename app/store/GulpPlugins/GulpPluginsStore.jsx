import { ReduceStore } from 'flux/utils';
import GulpPluginsDispatcher from './GulpPluginsDispatcher';
import Immutable from 'immutable';
import GulpPlugin from './GulpPlugin';
import $ from 'jquery';

class GulpPluginsStore extends ReduceStore {

  getInitialState() {
    $.get('http://npmsearch.com/query?fields=name,keywords,rating,description,author,modified,homepage,version&q=keywords:gulpfriendly&q=keywords:gulpplugin&size=20&sort=rating:desc',
    (result) => {
      let jsonResult = JSON.parse(result);
      this.state = {
        gulpPlugins: jsonResult
      };
      console.log("Plugins", this.state);
    });
    return Immutable.Map();
  }

  reduce(state, action) {
    switch (action.type) {
      default:
        return state;
    }
  }

}

const instance = new GulpPluginsStore(GulpPluginsDispatcher);
export default instance;
