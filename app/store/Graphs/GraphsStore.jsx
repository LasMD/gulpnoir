import { ReduceStore } from 'flux/utils';
import GraphsDispatcher from './GraphsDispatcher';

// We use this class to store our JointJS graphs live
// So that in the future we can save them
class GraphsStore extends ReduceStore {
  getInitialState() {
    // By their nature, JointJS graphs are mutable
    return {
      graphs: {}
    };
  }

  reduce(state, action) {
    switch (action.type) {
      case 'graphs/save': {
        state.graphs[action.graph.cid] = JSON.stringify(action.graph);
        return state;
      }
      default:
        return state;
    }
  }

  getGraphs() {
    return this.getState().graphs;
  }

}
const instance = new GraphsStore(GraphsDispatcher);
export default instance;
