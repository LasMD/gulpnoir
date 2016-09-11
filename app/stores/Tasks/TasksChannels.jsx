import { Channelizer } from 'channelizer';
import Immutable from 'immutable';
import Task from './Task';

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
        channel: 'delete',
        controller: ({ state, incoming }) => {

          let newState = state;

          // Close the deleted task
          let idx = newState.get('openTasks').indexOf(incoming.task.id * 1);
          let newOpenTasks = newState.get('openTasks').splice(idx, 1);
          newState = newState.set('openTasks', newOpenTasks);

          /**
           * The react-draggable-tab calls "handleTabSelect" promptly after
           * "handleTabClose" thereby updating the selected tab internally.
           * Not exactly sure how it decides which tab to select next--also can't
           * manually trigger.
           *
           * For now just fetch from the list of availables, left-first
           */
          if (newState.get('selectedTaskID') == incoming.task.id) {
            let openTaskIdx = idx - 1;
            if (openTaskIdx < 0) openTaskIdx = 0;
            let newSelectedTask;
            if (newOpenTasks.size > 0) {
              newSelectedTask = newOpenTasks.get(openTaskIdx);
            }
            newState = newState.set('selectedTaskID', newSelectedTask);
          }

          // Delete the task and its items
          newState = newState.deleteIn(['tasks', incoming.task.id]);
          newState = newState.deleteIn(['taskItems', incoming.task.id]);

          return newState;

        }
      })

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
          let { graph, connections } = state.get('tasks').get(incoming.task.id * 1).get('export')();
          let _newState = state.setIn(['tasks', (incoming.task.id * 1), 'graph'], graph);
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
          controller: ({ state, incoming }) => state.setIn(['taskItems', incoming.task.id, incoming.itemId], incoming.item)
        });

        receiver.tune({
          channel: 'set',
          controller: ({ state, incoming }) => state.set('taskItems', incoming.taskItems)
        });

        receiver.tune({
          channel: 'select',
          controller: ({ state, incoming }) => state.set('selectedItem', incoming)
        });


      }});

    }});
  }


  // Make sure the task isn't currently being used as a grid item
  // Users must manually delete grid items before deleting the full task
  // Similar to plugins which users must delete from grid(s) before uninstalling
  validateDeletion({ id }) {
    let seriesTasks = this.getTasks('Series');
    let parallelTasks = this.getTasks('Parallel');

    console.log(seriesTasks, parallelTasks);

    for (let task of seriesTasks) {
      console.log("s", task);
      let { connections } = task[1].get('export')('raw');
      for (let link of connections) {
        if (!link.data) continue;
        if (link.data.itemId == id) return false;
      }
    }

    for (let task of parallelTasks) {
      console.log("p", task);
      let { connections } = task[1].get('export')('raw');
      for (let link of connections) {
        if (!link.data) continue;
        if (link.data.itemId == id) return false;
      }
    }

    return true;
  }

  doDeleteTask({ id }) {
    if (!this.validateDeletion({ id })) return false;

    console.log("Initiating delete now");

    this.dispatch({
      channel: 'tasks/delete',
      outgoing: {
        task: {
          id: id
        }
      }
    });

    return true;
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

  getTaskById(taskId) {
    return this.getState().get('tasks').get(taskId) || false;
  }

  getOpenTasks() {
    return this.getState().get('openTasks') || [];
  }

  getTaskItems() {
    return this.getState().get('taskItems') || [];
  }

  getTaskItemById({taskId, itemId}) {
    return this.getState().getIn(['taskItems', taskId, itemId]);
  }

  getSelectedItem() {
    return this.getState().get('selectedItem');
  }


  ctrlNewTask({ state, incoming }) {
    if (!incoming.task) return state;
    let tasks = state.get('tasks');
    let taskNo = state.get('taskIndex') || 1;
    state = state.set('taskIndex', taskNo+1);
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
