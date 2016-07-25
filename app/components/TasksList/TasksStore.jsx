import { ReduceStore } from 'flux/utils';
import TasksDispatcher from './TasksDispatcher.jsx';
import Immutable from 'immutable';
import Task from './Task.jsx';

class TasksStore extends ReduceStore {

  getInitialState() {
    return Immutable.OrderedMap();
  }

  reduce(state, action) {
    switch (action.type) {
      case 'tasks/new': {
        action.task = action.task || {};
        return this.newTask({state, ...action.task});
      }
      default:
        return state;
    }
  }

  newTask({state, name, type}) {
    name = name || 'NewTask';
    type = type || "Functional";
    const newTask = new Task({name, type});
    return state.set(newTask.id, newTask);
  }
}
const instance = new TasksStore(TasksDispatcher);
export default instance;
