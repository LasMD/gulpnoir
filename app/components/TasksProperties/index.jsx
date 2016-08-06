import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TasksStore from '../../stores/Tasks/TasksStore';
import TaskComponent from './TaskComponent';
import InstalledPluginsComponent from './InstalledPluginsComponent';
import { TasksDispatch } from '../../stores/Tasks/TasksDispatcher';
import FlatButton from 'material-ui/FlatButton';
import {Container} from 'flux/utils';
import {List, ListItem} from 'material-ui/List';
import EditorFormatListBulleted from 'material-ui/svg-icons/editor/format-list-bulleted'
import ActionDonutSmall from 'material-ui/svg-icons/action/donut-small'

import './_style.scss';

class TasksProperties extends Component {


  static getStores() {
    return [TasksStore];
  }

  static calculateState(prevState) {
    return {
      openTasks: TasksStore.getOpenTasks(),
      tasks: TasksStore.getTasks(),
      selectedTask: TasksStore.getSelectedTask(),
      selectedItem: TasksStore.getSelectedItem(),
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      openTasks: TasksStore.getOpenTasks(),
      tasks: TasksStore.getTasks(),
      selectedTask: TasksStore.getSelectedTask()
    };
  }

  render() {

    let taskItem;
    if (this.state.selectedTask) {
      taskItem = (<TaskComponent task={this.state.selectedTask}></TaskComponent>);
    }

    let anyTasksOpen = this.state.openTasks.size > 0;
    let availableTasks = 0;

    if (this.state.tasks.size > 0) {
      availableTasks = [];
    }

    this.state.tasks.map((task) => {
      availableTasks.push((
        <ListItem primaryText={task.get('name')} onDoubleClick={this.openTask.bind(this, task.get('id'))} />
      ));
    });



    return (
      <div className={'task-list'}>
        <Tabs ref='tabs'>
          <Tab label='Available Items'>
            <List>
              <ListItem
                key={1}
                primaryText="Tasks"
                primaryTogglesNestedList={true}
                nestedItems={availableTasks ? availableTasks : []}
                leftIcon={<EditorFormatListBulleted />}
                />
              <InstalledPluginsComponent />
              <ListItem
                key={3}
                primaryText="Special"
                primaryTogglesNestedList={true}
                leftIcon={<ActionDonutSmall />}
              />
            </List>
          </Tab>
          {anyTasksOpen ? (
            <Tab label="Task Details">
              {(taskItem || 'Loading...')}
            </Tab>)
            : null
          }
        </Tabs>
      </div>
    );
  }

  openTask(id) {
    TasksDispatch({
      type: 'tasks/open',
      task: {
        id: id
      }
    });
  }

}

export default Container.create(TasksProperties);
