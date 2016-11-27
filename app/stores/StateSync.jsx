import transit from 'transit-immutable-js';
import lz from 'lzutf8';
import fs from 'fs';

export default class StateSync {

  static save(location, data) {
    if (!location) {
      if (!fs.statSync('/tmp/.gulpnoir')) {
        fs.mkdirSync('/tmp/.gulpnoir');
      }
      location = `/tmp/.gulpnoir/${_id}`;
    }

    let _tasks = data.tasks.get('tasks');

    for (let [id, task] of _tasks) {
      let { graph, connections } = data.tasks.get('tasks').get(id).get('export')();
      data.tasks = data.tasks.setIn(['tasks', (id * 1), 'graph'], graph);
      data.tasks = data.tasks.setIn(['tasks', (id * 1), 'connections'], connections);
      data.tasks = data.tasks.deleteIn(['tasks', (id * 1), 'selectedItem']);
    }
    
    let JSONCollection = {};
    JSONCollection._saved = [];
    for (let datum in data) {
      JSONCollection[datum] = transit.toJSON(data[datum]);
      JSONCollection._saved.push(datum);
    }

    const saveState = lz.compress(JSON.stringify(JSONCollection), {outputEncoding: 'BinaryString'});
    //const saveState = JSON.stringify(JSONCollection);
    fs.writeFile(location, saveState);
  }

  static load(location, data) {
    let fileContents = fs.readFileSync(location).toString();
    let JSONCollection = {};
    const decodeL1 = JSON.parse(lz.decompress(fileContents, {inputEncoding: 'BinaryString'}));
    //const decodeL1 = JSON.parse(fileContents);

    let _saved = decodeL1._saved;
    decodeL1._saved = null;

    for (let datum of _saved) {
      JSONCollection[datum] = transit.fromJSON(decodeL1[datum]);
    }

    return JSONCollection;
  }

}
