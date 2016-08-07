import { ReduceStore } from 'flux/utils';
import { Channelizer } from 'channelizer';
import { GulpPluginsDispatch } from '../GulpPlugins/GulpPluginsDispatcher';
import GulpPluginsStore from '../GulpPlugins/GulpPluginsStore';
import Immutable from 'immutable';
import Task from './Task';
import StateSync from '../StateSync';
import { ipcRenderer } from 'electron';

class TasksChannels extends Channelizer {

  Model() {
    ipcRenderer.on('save_state', (e, filename) => {
      StateSync.save(filename, {
        tasks: this.getState(),
        installedPlugins: GulpPluginsStore.getInstalledPlugins()
      });
    });
    ipcRenderer.on('load_state', (e, msg) => {
      let newstate = StateSync.load(msg);
      this.dispatch({
        channel: 'tasks/set',
        outgoing: {
          state: newstate.tasks
        }
      });
      GulpPluginsDispatch({
        type: 'plugins/installed/set',
        installed: newstate.installedPlugins
      });
    });

    return Immutable.Map()
    .set('tasks', Immutable.Map())
    .set('openTasks', Immutable.List())
    .set('_stateID', Date.now());

  }

  Channels({ receiver }) {

    receiver.world({
      prefix: 'tasks/',
      controller: ({ receiver }) => {

      receiver.tune({
        channel: 'set',
        controller: ({ state, incoming }) => incoming.state
      });

      receiver.tune({
        channel: 'setSelectedTaskID',
        controller: ({ state, incoming }) => state.set('selectedTaskID', incoming.task.id)
      });

      receiver.tune({
        channel: 'update',
        controller: ({ state, incoming }) => {
          let newState = state;

          for (let prop in incoming.task) {
            if (prop == 'id') continue;
            newState = newState.setIn(['tasks', incoming.task.id, prop], incoming.task[prop]);
          }
          return newState;
        }
      });

      receiver.tune({
        channel: 'new',
        controller: ({ state, incoming }) => {
          if (incoming.task) {
            return this._newTask({state, ...incoming.task});
          }
          return state;
        }
      });

      receiver.tune({
        channel: 'open',
        controller: ({ state, incoming }) => {
          let isTaskOpen = state.get('openTasks').indexOf(1*incoming.task.id);
          if (isTaskOpen > -1) {
            return state.set('selectedTaskID', 1*incoming.task.id);
          }
          let newOpenTasks = state.get('openTasks').push(1*incoming.task.id);
          return state.set('openTasks', newOpenTasks).set('selectedTaskID', 1*incoming.task.id);
        }
      });

      receiver.tune({
        channel: 'close',
        controller: ({ state, incoming }) => {
          let idx = state.get('openTasks').indexOf(1*incoming.task.id);
          let newOpenTasks = state.get('openTasks').splice(idx, 1);
          return state.set('openTasks', newOpenTasks);
        }
      });

      // Nested worlds are not yet allowed
      //
      // receiver.world('items/', ({ receiver }) => {
      //
      //   receiver.tune({
      //     channel: 'new',
      //     controller: ({ state, incoming }) => newState.setIn(['taskItems', incoming.task.id, prop], incoming.task[prop])
      //   });
      //
      //   receiver.tune({
      //     channel: 'select',
      //     controller: ({ state, incoming }) => state.set('selectedItem', incoming.item)
      //   });
      //
      // });

    }});
  }

  getSelectedTask() {
    const selectedTaskID = this.getState().get('selectedTaskID');
    return this.getState().get('tasks').get(selectedTaskID) || 0;
  }

  getTasks() {
    return this.getState().get('tasks') || [];
  }

  getOpenTasks() {
    return this.getState().get('openTasks') || [];
  }

  getTaskItems() {
    return this.getState().get('taskItems') || [];
  }

  getSelectedItem() {
    return this.getState().get('selectedItem');
  }


  _newTask({state, name, type}) {
    let tasks = state.get('tasks');
    let taskNo = 1;
    if (tasks) {
      taskNo = tasks.size + 1;
    }
    name = name || 'NewTask' + taskNo;
    type = type || "Functional";
    const newTask = new Task({name, type});

    let newState = state.set('selectedTaskID', newTask.id)
      .setIn(['tasks', newTask.id], newTask);
    let newOpenTasks = newState.get('openTasks').push(newTask.get('id'));
    return newState.set('openTasks', newOpenTasks);
  }
}
const instance = new TasksChannels();
export default instance;
