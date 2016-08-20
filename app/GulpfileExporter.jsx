import fs from 'fs';

export default class Exporter {

  constructor({filename, tasks, plugins}) {
    this.filename = filename;
    this.tasks = tasks;
    this.plugins = plugins;
  }

  _writePlugins() {
    let result = [];
    for (let plugin of this.plugins) {
      let pluginName = plugin[0];
      let pluginFriendlyName = pluginName.replace(/gulp-/, '').replace(/-([a-z])/g, (full, letter) => {
        return letter.toUpperCase();
      });
      result.push(`import ${pluginFriendlyName} from '${plugin[0]}';`);
    }
    return result;
  }

  write() {
    let fileLines = [];
    fileLines.push(...this._writePlugins());
    fs.writeFile(this.filename, fileLines.join('\n'));
  }

}
