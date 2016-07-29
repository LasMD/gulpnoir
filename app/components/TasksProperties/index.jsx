import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TasksStore from '../../store/Tasks/TasksStore';
import TaskComponent from './TaskComponent';
import { TasksDispatch } from '../../store/Tasks/TasksDispatcher';
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
      selectedTask: TasksStore.getSelectedTask(),
      selectedItem: TasksStore.getSelectedItem(),
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      tasks: TasksStore.getTasks(),
      selectedTask: TasksStore.getSelectedTask()
    };
  }

  render() {

    let propertiesDisabled = true;

    if (this.state.selectedItem) {
      propertiesDisabled = false;
    }

    let taskItem;
    if (this.state.selectedTask) {
      taskItem = (<TaskComponent task={this.state.selectedTask}></TaskComponent>);
    }

    return (
      <div className={'tasks-list'}>
        <Tabs>
          <Tab label="Task Details">
          {(taskItem || 'Loading...')}
          </Tab>
          <Tab label="Item Properties" disabled={propertiesDisabled}></Tab>
        </Tabs>
      </div>
    );
  }
}

export default Container.create(TasksProperties);
