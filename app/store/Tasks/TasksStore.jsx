import { ReduceStore } from 'flux/utils';
import TasksDispatcher from './TasksDispatcher.jsx';
import Immutable from 'immutable';
import Task from './Task.jsx';

class TasksStore extends ReduceStore {

  getInitialState() {
    return Immutable.Map();
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
      default:
        return state;
    }
  }

  getSelectedTaskID() {
    return this.getState().getIn(['selectedTaskID']) || 0;
  }

  getTasks() {
    return this.getState().getIn(['tasks']) || [];
  }

  _newTask({state, name, type}) {
    let tasks = state.getIn(['tasks']);
    let taskNo = 1;
    if (tasks) {
      taskNo = tasks.size + 1;
    }
    name = name || 'NewTask' + taskNo;
    type = type || "Functional";
    const newTask = new Task({name, type});

    return state.set('selectedTaskID', newTask.id)
      .setIn(['tasks', newTask.id], newTask);
  }
}
const instance = new TasksStore(TasksDispatcher);
export default instance;
