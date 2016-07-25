import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TasksStore from './TasksStore.jsx';
import TaskItem from './TaskItem.jsx';
import { TasksDispatch } from './TasksDispatcher.jsx';
import FlatButton from 'material-ui/FlatButton';
import {Container} from 'flux/utils';

import './_style.scss';

class TasksList extends Component {


  static getStores() {
    return [TasksStore]
  }

  static calculateState(prevState) {
    return {
      tasks: TasksStore.getState()
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      tasks: TasksStore.getState()
    };
  }

  addTask() {
    TasksDispatch({
      type: 'tasks/new'
    });
  }

  render() {

    const taskItems = [];
    for (let [id, task] of this.state.tasks) {
      taskItems.push(<TaskItem task={task} />);
    }

    return (
      <div className={'tasks-list'}>
        <Tabs>
          <Tab label="Tasks">
          {taskItems}
          <FlatButton label="Add Task" onClick={this.addTask} />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default Container.create(TasksList);
