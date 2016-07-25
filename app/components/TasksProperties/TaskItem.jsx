import React, { Component } from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { Container } from 'flux/utils';

import { TasksDispatch } from './TasksDispatcher.jsx';
import TasksStore from './TasksStore.jsx';

class TaskItem extends Component {

  static getStores() {
    return [TasksStore];
  }

  static calculateState() {
    return {};
  }

  render() {
    const { task } = this.props;
    return (
      <div>
        <TextField
          ref={'taskName'}
          hintText={'Internal Task Name'}
          defaultValue={task.name}
        />
        <RadioButtonGroup ref={'taskType'} name="taskType" defaultSelected={task.type}>
          <RadioButton
            value="Functional"
            label="Functional"
          />
          <RadioButton
            value="Parallel"
            label="Parallel"
          />
        </RadioButtonGroup>
        <FlatButton label="Save Changes" onClick={this._doSaveChanges.bind(this)} />
      </div>
    );
  }

  _doSaveChanges() {
    let tempTask = this.props.task;
    tempTask.set('name', this.refs.taskName.value);
    tempTask.set('type', this.refs.taskType.value);
    TasksDispatch({
      type: 'tasks/update',
      task: tempTask
    });
  }

}

export default Container.create(TaskItem);
