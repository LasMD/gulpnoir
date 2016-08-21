import fs from 'fs';
import GulpPluginsChannels from './stores/GulpPlugins/GulpPluginsChannels';
import TasksChannels from './stores/Tasks/TasksChannels';

export default class Exporter {

  constructor({ filename }) {
    this.filename = filename;
    this.tasks = {
      functional: TasksChannels.getTasks('Functional'),
      parallel: TasksChannels.getTasks('Parallel'),
      series: TasksChannels.getTasks('Series')
    };
    this.plugins = GulpPluginsChannels.getInstalledPlugins();

    this.headline = `
    /**
     * This file was automatically generated by Gulpnoir
     * To find out more, visit https://github.com/VYNYL/gulpnoir
     **/
    `;
  }

  _friendlify(str) {
    return str.replace(/gulp-/, '').replace(/-([a-z])/g, (full, letter) => {
      return letter.toUpperCase();
    });
  }

  _writePlugins() {
    let result = [];
    result.push(`import gulp from 'gulp';`);
    for (let plugin of this.plugins) {
      let pluginName = plugin[0];
      let pluginFriendlyName = this._friendlify(pluginName);
      result.push(`import ${pluginFriendlyName} from '${plugin[0]}';`);
    }
    result.push('');
    return result;
  }

  _writeFunctionalTasks() {
    let result = [];
    for (let task of this.tasks.functional) {
      result.push(`export function ${task[1].get('name')}() {`);
      let connections = task[1].get('exportConnections')();
      let resultAppend = ``;
      for (let i = 0; i < connections.length; i++) {
        if (i == 0) {
          resultAppend = `\treturn gulp.src('./my/path')`;
        } else if (i > 0) {
          console.log(connections);
          let pluginObj = GulpPluginsChannels.getPluginObjectById(connections[i].itemId);
          console.log(pluginObj);
          let friendlyName = this._friendlify(pluginObj.name);
          resultAppend = `\t\t.pipe(${friendlyName}())`;
        }
        if (i == connections.length - 1) {
          result.push(resultAppend + ';');
          result.push(`}`);
        } else {
          result.push(resultAppend);
        }
      }
    }
    result.push('');
    return result;
  }

  _writeParallelTasks() {
    let result = [];
    for (let task of this.tasks.parallel) {
      result.push(`export const ${task[1].get('name')} = gulp.parallel(some, parallel);`);
    }
    result.push('');
    return result;
  }

  _writeSeriesTasks() {
    let result = [];
    for (let task of this.tasks.series) {
      result.push(`export const ${task[1].get('name')} = gulp.series(some, series);`);
    }
    result.push('');
    return result;
  }

  _writeTasks() {
    return [
      ...this._writeFunctionalTasks(),
      ...this._writeParallelTasks(),
      ...this._writeSeriesTasks()
    ];
  }

  write() {
    let fileLines = [];
    fileLines.push(this.headline);
    fileLines.push(...this._writePlugins());
    fileLines.push(...this._writeTasks());
    fs.writeFile(this.filename, fileLines.join('\n'));
  }

}