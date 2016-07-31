import { ReduceStore } from 'flux/utils';
import TasksDispatcher, { TasksDispatch } from './TasksDispatcher';
import Immutable from 'immutable';
import Task from './Task.jsx';
import StateSync from '../StateSync';
import { ipcRenderer } from 'electron';

class TasksStore extends ReduceStore {

  getInitialState() {
    ipcRenderer.on('save_state', (e, filename) => {
      StateSync.save(filename, {
        tasks: this.getState(),
      });
    });
    ipcRenderer.on('load_state', (e, msg) => {
      let newstate = StateSync.load(msg);
      TasksDispatch({
        type: 'tasks/set',
        newstate: newstate.tasks
      });
    });
    return Immutable.Map()
    .set('tasks', Immutable.Map())
    .set('openTasks', Immutable.List())
    .set('_stateID', Date.now());
  }

  reduceProcess(state, action) {
    switch (action.type) {
      case 'tasks/set': {

        return action.newstate;
      }
      case 'tasks/new': {
        action.task = action.task || {};
        return this._newTask({state, ...action.task});
      }
      case 'tasks/setSelectedTaskID': {
        return state.set('selectedTaskID', action.task.id);
      }
      case 'tasks/update': {
        let newState = state;

        for (let prop in action.task) {
          if (prop == 'id') continue;
          newState = newState.setIn(['tasks', action.task.id, prop], action.task[prop]);
        }
        return newState;
      }
      case 'tasks/items/new': {
        newState = newState.setIn(['taskItems', action.task.id, prop], action.task[prop]);
      }
      case 'tasks/items/select': {
        return state.set('selectedItem', action.item);
      }
      case 'tasks/open': {
        let isTaskOpen = state.get('openTasks').indexOf(1*action.task.id);
        if (isTaskOpen > -1) {
          return state.set('selectedTaskID', 1*action.task.id);
        }
        let newOpenTasks = state.get('openTasks').push(1*action.task.id);
        return state.set('openTasks', newOpenTasks).set('selectedTaskID', 1*action.task.id);
      }
      case 'tasks/close': {
        let idx = state.get('openTasks').indexOf(1*action.task.id);
        let newOpenTasks = state.get('openTasks').splice(idx, 1);
        return state.set('openTasks', newOpenTasks);
      }
      default:
        return state;
    }
  }

  reduce(state, action) {
    let newState = this.reduceProcess(state, action);
    return newState;
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
const instance = new TasksStore(TasksDispatcher);
export default instance;
