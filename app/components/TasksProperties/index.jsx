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
      selectedTaskID: TasksStore.getSelectedTaskID(),
      selectedItem: TasksStore.getSelectedItem(),
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

    const TaskComponents = {};
    for (let [id, task] of this.state.tasks) {
      TaskComponents[id] = (<TaskComponent task={task} />);
    }

    let propertiesDisabled = true;

    if (this.state.selectedItem) {
      propertiesDisabled = false;
    }

    return (
      <div className={'tasks-list'}>
        <Tabs>
          <Tab label="Task Details">
          {(TaskComponents[this.state.selectedTaskID] || 'Loading...')}
          </Tab>
          <Tab label="Item Properties" disabled={propertiesDisabled}></Tab>
        </Tabs>
      </div>
    );
  }
}

export default Container.create(TasksProperties);
