import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TasksStore from './TasksStore.jsx';
import TaskItem from './TaskItem.jsx';
import { TasksDispatch } from './TasksDispatcher.jsx';
import FlatButton from 'material-ui/FlatButton';
import {Container} from 'flux/utils';

import './_style.scss';

class TasksProperties extends Component {


  static getStores() {
    return [TasksStore];
  }

  static calculateState(prevState) {
    return {
      tasks: TasksStore.getTasks(),
      selectedTaskID: TasksStore.getSelectedTaskID()
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      tasks: TasksStore.getTasks(),
      selectedTaskID: TasksStore.getSelectedTaskID()
    };
  }

  render() {

    const taskItems = {};
    for (let [id, task] of this.state.tasks) {
      taskItems[id] = (<TaskItem task={task} />);
    }

    return (
      <div className={'tasks-list'}>
        <Tabs>
          <Tab label="Properties">
          {(taskItems[this.state.selectedTaskID] || 'Loading...')}
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default Container.create(TasksProperties);
