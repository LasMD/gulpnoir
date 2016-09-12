import React, { Component } from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TasksChannels from '../../stores/Tasks/TasksChannels';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import {Container} from 'flux/utils';
import {List, ListItem} from 'material-ui/List';
import EditorFormatListBulleted from 'material-ui/svg-icons/editor/format-list-bulleted'
import ActionDonutSmall from 'material-ui/svg-icons/action/donut-small'
import TaskDetailFull from '../TaskDetailFull';

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
      <div className={'tasks-list'}>
        <Toolbar className={'Toolbar'}>
          <ToolbarGroup firstChild={true}>
            <ToolbarTitle className={'ToolbarTitle'} text="Functional Tasks" />
          </ToolbarGroup>
        </Toolbar>
        {tasksList}
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

export default Container.create(TasksDetail);
