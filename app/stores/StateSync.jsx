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
    }

    let JSONCollection = {};
    for (let datum in data) {
      console.log(datum);
      JSONCollection[datum] = transit.toJSON(data[datum]);
    }

    const saveState = lz.compress(JSON.stringify(JSONCollection), {outputEncoding: 'BinaryString'});
    fs.writeFile(location, saveState);
  }

  static load(location, data) {
    let fileContents = fs.readFileSync(location).toString();
    let JSONCollection = {};
    const decodeL1 = JSON.parse(lz.decompress(fileContents, {inputEncoding: 'BinaryString'}));

    for (let datum of data) {
      JSONCollection[datum] = transit.fromJSON(decodeL1[datum]);
    }
    JSONCollection.tasks = transit.fromJSON(decodeL1.tasks);
    JSONCollection.installedPlugins = transit.fromJSON(decodeL1.installedPlugins);
    JSONCollection.pluginObjects = transit.fromJSON(decodeL1.pluginObjects);

    return JSONCollection;
  }

}
