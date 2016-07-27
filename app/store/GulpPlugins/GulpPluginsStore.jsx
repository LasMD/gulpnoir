import { ReduceStore } from 'flux/utils';
import GulpPluginsDispatcher from './GulpPluginsDispatcher';
import Immutable from 'immutable';
import GulpPlugin from './GulpPlugin';

class GulpPluginsStore extends ReduceStore {

  getInitialState() {
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
