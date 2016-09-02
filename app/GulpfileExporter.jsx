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
     * This file was automatically generated by GulpNoir
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

  // Write globs first
  _writeGlobs() {
    let result = [];
    result.push(`let paths = {`);
    let i = 0;
    for (let task of this.tasks.functional) {
      i++;
      let pipeSource = TasksChannels.getTaskItemById({taskId: task[0], itemId: 'PipeSource'});
      result.push(`\t${task[1].get('name')}: {`);
      result.push(`\t\tsrc: ['${pipeSource.get('glob')}']`)
      result.push(`\t\tdest: '${pipeSource.get('dest')}'`)
      let resultAppend = '\t}';
      if (i >= this.tasks.functional.size) {
        resultAppend += '\n};';
      } else {
        resultAppend += ',';
      }
      result.push(resultAppend);
    }
    result.push('');
    return result;
  };

  _writeFunctionalTasks() {

    let result = this._writeGlobs();

    for (let task of this.tasks.functional) {
      let pipeSource = TasksChannels.getTaskItemById({taskId: task[0], itemId: 'PipeSource'});
      result.push(`export function ${task[1].get('name')}() {`);
      let { connections } = task[1].get('export')('raw');
      let resultAppend = ``;
      for (let link of connections) {
        if (link == connections.first) {
          resultAppend = `\treturn gulp.src(paths.${task[1].get('name')}.src)`;
        } else {
          console.log(connections);
          let pluginObj = GulpPluginsChannels.getPluginObjectById(link.data.itemId);
          console.log(pluginObj);
          let friendlyName = this._friendlify(pluginObj.get('name'));
          resultAppend = `\t\t.pipe(${friendlyName}(`;
          let pluginParams =  pluginObj.get('params');
          for (let i = 0; i < pluginParams.length; i++) {
            resultAppend += pluginParams[i];
            if (i < pluginParams.length-1) {
              resultAppend += ',';
            }
          }
          resultAppend += '))';
        }
        if (link == connections.last) {
          result.push(resultAppend);
          result.push(`\t\t.pipe(gulp.dest(paths.${task[1].get('name')}.dest));`)
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
      result.push(`export ${task[1].get('name')} = gulp.parallel(`);
      let { connections } = task[1].get('export')('raw');
      console.log("parallel connections", connections);
      let idx = 0;
      for (let link of connections.values()) {

        // Skip Parallel which is the only one with a previous chain
        if (link.previous) continue;
        let task = TasksChannels.getTaskById(link.data.itemId);
        console.log("link", link, "task", task);
        let resultAppend = `\t${task.get('name')}`;
        if (idx < connections.size - 1) {
          resultAppend += `,`;
        }
        result.push(resultAppend);
        idx++;
      }
      result.push(`);`);
    }
    result.push('');
    return result;
  }

  _writeSeriesTasks() {
    let result = [];
    for (let task of this.tasks.series) {
      result.push(`export ${task[1].get('name')} = gulp.series(`);
      let { connections } = task[1].get('export')('raw');
      console.log("series connections", connections);
      for (let link of connections) {
        // Skip initial series block
        if (link.data.itemId == 'series') continue;
        let task = TasksChannels.getTaskById(link.data.itemId);
        console.log("link", link, "task", task);
        let resultAppend = `\t${task.get('name')}`;
        if (connections.next) {
          resultAppend += `,`;
        }
        result.push(resultAppend);
      }
      result.push(`);`);
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
