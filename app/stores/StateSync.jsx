import transit from 'transit-immutable-js';
import lz from 'lzutf8';
import fs from 'fs';

export default class StateSync {

  static save(location, { tasks, installedPlugins }) {
    if (!location) {
      if (!fs.statSync('/tmp/.gulpnoir')) {
        fs.mkdirSync('/tmp/.gulpnoir');
      }
      location = `/tmp/.gulpnoir/${_id}`;
    }

    // We don't save the last item selected
    if (tasks.get('selectedItem')) {
      tasks = tasks.delete('selectedItem');
    }
    
    let _tasks = tasks.get('tasks');

    for (let [id, task] of _tasks) {
      let { graph, connections } = tasks.get('tasks').get(id).get('export')();
      tasks = tasks.setIn(['tasks', (id * 1), 'graph'], graph);
      tasks = tasks.setIn(['tasks', (id * 1), 'connections'], connections);
    }

    let JSONCollection = {};
    JSONCollection.tasks = transit.toJSON(tasks);
    JSONCollection.installedPlugins = transit.toJSON(installedPlugins);

    const saveState = lz.compress(JSON.stringify(JSONCollection), {outputEncoding: 'BinaryString'});
    fs.writeFile(location, saveState);
  }

  static load(location) {
    let fileContents = fs.readFileSync(location).toString();
    let JSONCollection = {};
    const decodeL1 = JSON.parse(lz.decompress(fileContents, {inputEncoding: 'BinaryString'}));

    JSONCollection.tasks = transit.fromJSON(decodeL1.tasks);
    JSONCollection.installedPlugins = transit.fromJSON(decodeL1.installedPlugins);

    return JSONCollection;
  }

}
