import transit from 'transit-immutable-js';
import lz from 'lz-string';
import fs from 'fs';

export default class StateSync {

  static save(state) {
    if (!fs.statSync('/tmp/.gulpnoir')) {
      fs.mkdirSync('/tmp/.gulpnoir');
    }
    let _id = state.get('_stateID');
    if (state.get('selectedItem')) {
      let graph = JSON.stringify(state.get('selectedItem').graph);
      state = state.delete('selectedItem').set('_graph', graph);
    }
    let saveState = lz.compress(JSON.stringify(transit.toJSON(state)));
    fs.writeFile(`/tmp/.gulpnoir/${_id}`, saveState);
  }

}
