import GulpPluginsChannels from './stores/GulpPlugins/GulpPluginsChannels';
import TasksChannels from './stores/Tasks/TasksChannels';
import StateSync from './stores/StateSync';
import { ipcRenderer } from 'electron';
import GulpfileExporter from './GulpfileExporter';

class ipcEvents {
  constructor() {
    this.validEvents = [
      'eSaveState',
      'eLoadState',
      'eExport'
    ];

    this.init();
  }

  eSaveState(e, filename) {
    StateSync.save(filename, {
      tasks: TasksChannels.getState(),
      installedPlugins: GulpPluginsChannels.getInstalledPlugins()
    });
  }

  eLoadState(e, filename) {
    let newstate = StateSync.load(filename);
    TasksChannels.dispatch({
      channel: 'tasks/set',
      outgoing: {
        state: newstate.tasks
      }
    });
    GulpPluginsChannels.dispatch({
      channel: 'plugins/installed/set',
      outgoing: {
        installed: newstate.installedPlugins
      }
    });

  }

  eExport(e, filename) {
    let tasks = TasksChannels.getState();
    if (tasks.get('tasks').size == 0) {
      alert("You can't export a Gulpfile without any tasks");
    } else {
      let taskGraphs = {};
      let _tasks = tasks.get('tasks');
      let exporter = new GulpfileExporter({filename, tasks: _tasks, plugins: GulpPluginsChannels.getInstalledPlugins()});
      // for (let [id, task] of _tasks) {
      //   let getTask = _tasks.get(id);
      //   taskGraphs[getTask.get('name')] = getTask.get('exportGraph')(true);
      // }
      // console.log(taskGraphs);
      exporter.write();
    }
  }

  init() {
    for (let e of this.validEvents) {
      ipcRenderer.on(e, this[e]);
    }
  }
}

new ipcEvents();
