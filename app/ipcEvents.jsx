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
      taskItems: TasksChannels.getTaskItems(),
      installedPlugins: GulpPluginsChannels.getInstalledPlugins(),
      pluginObjects: GulpPluginsChannels.getGulpPluginObjects()
    });
  }

  eLoadState(e, filename) {
    let newstate = StateSync.load(filename, ['tasks', 'taskItems', 'installedPlugins', 'pluginObjects']);
    TasksChannels.dispatch({
      channel: 'tasks/set',
      outgoing: {
        state: newstate.tasks
      }
    });
    TasksChannels.dispatch({
      channel: 'tasks/items/set',
      outgoing: {
        taskItems: newstate.taskItems
      }
    });
    GulpPluginsChannels.dispatch({
      channel: 'plugins/installed/set',
      outgoing: {
        installed: newstate.installedPlugins
      }
    });
    GulpPluginsChannels.dispatch({
      channel: 'plugins/object/setAll',
      outgoing: {
        pluginObjects: newstate.pluginObjects
      }
    });

  }

  eExport(e, filename) {
    let tasks = TasksChannels.getState();
    if (tasks.get('tasks').size == 0) {
      alert("You can't export a Gulpfile without any tasks");
    } else {
      let taskGraphs = {};
      let exporter = new GulpfileExporter({filename});
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
