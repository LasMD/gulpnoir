import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TaskComponent from './TaskComponent';
import InstalledPluginsComponent from '../InstalledPlugins';
import TasksChannels from '../../stores/Tasks/TasksChannels';
import FlatButton from 'material-ui/FlatButton';
import {Container} from 'flux/utils';
import {List, ListItem} from 'material-ui/List';
import EditorFormatListBulleted from 'material-ui/svg-icons/editor/format-list-bulleted'
import ActionDonutSmall from 'material-ui/svg-icons/action/donut-small'

import './_style.scss';

class TasksProperties extends Component {


  static getStores() {
    return [TasksChannels];
  }

  static calculateState(prevState) {
    return {
      openTasks: TasksChannels.getOpenTasks(),
      tasks: TasksChannels.getTasks(),
      selectedTask: TasksChannels.getSelectedTask(),
      selectedItem: TasksChannels.getSelectedItem(),
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      openTasks: TasksChannels.getOpenTasks(),
      tasks: TasksChannels.getTasks(),
      selectedTask: TasksChannels.getSelectedTask()
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

    this.state.tasks.map((task, id) => {
      availableTasks.push((
        <ListItem key={task.get('id')} primaryText={task.get('name')} onDoubleClick={this.openTask.bind(this, task.get('id'))} />
      ));
    });

    // let specialItems = [
    //   (<ListItem primaryText={'Code Pipe In'} />),
    //   (<ListItem primaryText={'Parallel'} />)
    // ];

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
                // nestedItems={specialItems ? specialItems : []}
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
    TasksChannels.dispatch({
      channel: 'tasks/open',
      outgoing: {
        task: {
          id: id
        }
      }
    });
  }

}

export default Container.create(TasksProperties);
