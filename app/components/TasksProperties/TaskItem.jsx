import React, { Component } from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from '../MutableTextField';
import FlatButton from 'material-ui/FlatButton';
import { Container } from 'flux/utils';

import { TasksDispatch } from './TasksDispatcher.jsx';
import TasksStore from './TasksStore.jsx';

class TaskItem extends Component {

  static getStores() {
    return [TasksStore];
  }

  static calculateState() {
    return {
      tasks: TasksStore.getTasks()
    };
  }

  render() {
    const task = this.state.tasks.get(this.props.task.id);
    if (this.refs[`taskName${task.id}`]) {
      this.refs[`taskName${task.id}`].forceUpdate();
    }
    console.log("SetTask", task);
    return (
      <div>
        <TextField
          name={`taskName${task.id}`}
          ref={`taskName${task.id}`}
          value={task.name}
          onSave={this._saveName.bind(this)}
        />
        <RadioButtonGroup ref={`taskType${task.id}`} name={`taskType${task.id}`} selected={task.type}>
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

  _saveName(name) {
    TasksDispatch({
      type: 'tasks/update',
      task: {
        id: this.props.task.id,
        name: name
      }
    });
  }

  _doSaveChanges() {

  }

}

export default Container.create(TaskItem);
