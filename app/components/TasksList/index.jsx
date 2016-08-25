import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TaskDetailFull from '../TaskDetailFull';
import TasksChannels from '../../stores/Tasks/TasksChannels';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import {Container} from 'flux/utils';
import {List, ListItem} from 'material-ui/List';
import EditorFormatListBulleted from 'material-ui/svg-icons/editor/format-list-bulleted'
import ActionDonutSmall from 'material-ui/svg-icons/action/donut-small'

import './_style.scss';

class TasksDetail extends Component {


  static getStores() {
    return [TasksChannels];
  }

  static calculateState(prevState) {
    return {
      tasks: TasksChannels.getTasks('Functional'),
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      tasks: TasksChannels.getTasks(),
    };
  }

  render() {

    let tasksList = this.state.tasks.map((task) => {
      return <TaskDetailFull task={task} />;
    });

    return (
      <Tabs className={'tasks-list'}>
        <Tab label="Available Tasks">
          {tasksList}
        </Tab>
      </Tabs>
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

export default Container.create(TasksDetail);
