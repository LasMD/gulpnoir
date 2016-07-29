import { ReduceStore } from 'flux/utils';
import TasksDispatcher from './TasksDispatcher.jsx';
import Immutable from 'immutable';
import Task from './Task.jsx';

class TasksStore extends ReduceStore {

  getInitialState() {
    return Immutable.Map().set('tasks', Immutable.List()).set('openTasks', Immutable.List());
  }

  reduce(state, action) {
    switch (action.type) {
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
        let isTaskOpen = state.get('openTasks').find((obj) => {
          return obj.get('id') == action.task.id;
        });
        if (isTaskOpen) return state;

        let task = state.get('tasks').find((obj) => {
          return obj.get('id') == action.task.id;
        });
        let newOpenTasks = state.get('openTasks').push(task);
        return state.set('openTasks', newOpenTasks).set('selectedTaskID', action.task.id);
      }
      case 'tasks/close': {
        let idx = state.get('openTasks').findKey((obj) => {
          return obj.get('id') == action.task.id;
        });
        let newOpenTasks = state.get('openTasks').splice(idx, 1);
        return state.set('openTasks', newOpenTasks);
      }
      default:
        return state;
    }
  }

  getSelectedTask() {
    let selectedTaskID = this.getState().get('selectedTaskID');
    return this.getState().get('tasks').find((obj) => {
      return obj.get('id') == selectedTaskID;
    }) || 0;
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

    let newState = state.set('selectedTaskID', newTask.id);
    let newTasks = state.get('tasks').push(newTask);
    let newOpenTasks = state.get('openTasks').push(newTask);
    return newState.set('tasks', newTasks).set('openTasks', newOpenTasks);
  }
}
const instance = new TasksStore(TasksDispatcher);
export default instance;
