import { ReduceStore } from 'flux/utils';
import { Channelizer } from 'channelizer';
import Immutable from 'immutable';
import Task from './Task';
import ipcEvents from '../../ipcEvents';

class TasksChannels extends Channelizer {

  Model() {

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
        controller: this.ctrlNewTask
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
          let _newState = state.setIn(['tasks', (incoming.task.id * 1), 'graph'], state.get('tasks').get(incoming.task.id * 1).get('exportGraph')());
          let idx = _newState.get('openTasks').indexOf(incoming.task.id * 1);
          let newOpenTasks = _newState.get('openTasks').splice(idx, 1);
          return _newState.set('openTasks', newOpenTasks);
        }
      });

      receiver.tune({
        channel: 'arrange',
        controller: ({ state, incoming }) => {
          let openTaskLength = state.get('openTasks').size;
          let newOpenTaskArrangement = state.get('openTasks').splice(0, openTaskLength);
          incoming.forEach((newTabArrangement) => {
            newOpenTaskArrangement = newOpenTaskArrangement.push(newTabArrangement.key * 1);
          });
          return state.set('openTasks', newOpenTaskArrangement);
        }
      });

      receiver.world({
        prefix: 'items/',
        controller: ({ receiver }) => {

        receiver.tune({
          channel: 'new',
          controller: ({ state, incoming }) => newState.setIn(['taskItems', incoming.task.id, prop], incoming.task[prop])
        });

        receiver.tune({
          channel: 'select',
          controller: ({ state, incoming }) => state.set('selectedItem', incoming.item)
        });

      }});

    }});
  }

  getSelectedTask() {
    const selectedTaskID = this.getState().get('selectedTaskID');
    return this.getState().get('tasks').get(selectedTaskID) || 0;
  }

  getTasks(type) {
    if (!type) return this.getState().get('tasks');
    let tasks = this.getState().get('tasks');
    let tasksToReturn = Immutable.Map();
    for (let [idx, task] of tasks) {
      if (task.get('type') == type) {
        tasksToReturn = tasksToReturn.set(task.id, task);
      }
    }
    return tasksToReturn;
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


  ctrlNewTask({ state, incoming }) {
    if (!incoming.task) return state;
    let tasks = state.get('tasks');
    let taskNo = 1;
    if (tasks) {
      taskNo = tasks.size + 1;
    }
    let name = incoming.task.name || 'NewTask' + taskNo;
    let type = incoming.task.type || "Functional";
    const newTask = new Task({ name, type });

    let newState = state.set('selectedTaskID', newTask.id)
      .setIn(['tasks', newTask.id], newTask);
    let newOpenTasks = newState.get('openTasks').push(newTask.get('id'));
    return newState.set('openTasks', newOpenTasks);
  }
}
const instance = new TasksChannels();
export default instance;
