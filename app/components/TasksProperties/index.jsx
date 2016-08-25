import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TaskComponent from './TaskComponent';
import InstalledPluginsComponent from '../InstalledPlugins';
import TasksChannels from '../../stores/Tasks/TasksChannels';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

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
      functionalTasks: TasksChannels.getTasks('Functional'),
      parallelTasks: TasksChannels.getTasks('Parallel'),
      sequenceTasks: TasksChannels.getTasks('Sequence'),
      selectedTask: TasksChannels.getSelectedTask(),
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      openTasks: TasksChannels.getOpenTasks(),
      functionalTasks: TasksChannels.getTasks('Functional'),
      parallelTasks: TasksChannels.getTasks('Parallel'),
      sequenceTasks: TasksChannels.getTasks('Sequence'),
      selectedTask: TasksChannels.getSelectedTask()
    };
  }

  render() {

    let taskItem;
    if (this.state.selectedTask) {
      taskItem = (<TaskComponent task={this.state.selectedTask}></TaskComponent>);
    }

    let anyTasksOpen = this.state.openTasks.size > 0;

    let availableFunctionalTasks = 0;
    if (this.state.functionalTasks.size > 0) {
      availableFunctionalTasks = [];
    }
    this.state.functionalTasks.map((task, id) => {
      availableFunctionalTasks.push((
        <ListItem key={task.get('id')} primaryText={task.get('name')} onDoubleClick={this.openTask.bind(this, task.get('id'))} />
      ));
    });


    let availableParallelTasks = 0;
    if (this.state.parallelTasks.size > 0) {
      availableParallelTasks = [];
    }
    this.state.parallelTasks.map((task, id) => {
      availableParallelTasks.push((
        <ListItem key={task.get('id')} primaryText={task.get('name')} onDoubleClick={this.openTask.bind(this, task.get('id'))} />
      ));
    });


    let availableSequenceTasks = 0;
    if (this.state.sequenceTasks.size > 0) {
      availableSequenceTasks = [];
    }
    this.state.sequenceTasks.map((task, id) => {
      availableSequenceTasks.push((
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
            <Paper className={`propertyPaper`} zDepth={1}>
              <List>
                <ListItem
                  key={1}
                  primaryText="Tasks"
                  primaryTogglesNestedList={true}
                  nestedItems={[
                    <ListItem
                      key={"TasksFunctional"}
                      primaryText="Functional"
                      primaryTogglesNestedList={true}
                      nestedItems={availableFunctionalTasks ? availableFunctionalTasks : []}
                    />,
                    <ListItem
                      key={"TasksParallel"}
                      primaryText="Parallel"
                      primaryTogglesNestedList={true}
                      nestedItems={availableParallelTasks ? availableParallelTasks : []}
                    />,
                    <ListItem
                      key={"TasksSequence"}
                      primaryText="Sequence"
                      primaryTogglesNestedList={true}
                      nestedItems={availableSequenceTasks ? availableSequenceTasks : []}
                    />
                  ]}
                  leftIcon={<EditorFormatListBulleted />}
                  />
                <InstalledPluginsComponent />
              </List>
            </Paper>
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
