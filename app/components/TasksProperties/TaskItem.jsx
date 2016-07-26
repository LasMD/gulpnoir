import React, { Component } from 'react';
import { RadioButton } from 'material-ui/RadioButton';
import TextField from '../MutableTextField';
import RadioButtonGroup from '../MutableRadioButtonGroup';
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
        />
        <RadioButtonGroup
          ref={`taskType${task.id}`}
          name={`taskType${task.id}`}
          selected={task.type}>
          <RadioButton
            value="Functional"
            label="Functional"
          />
          <RadioButton
            value="Parallel"
            label="Parallel"
          />
        </RadioButtonGroup>
        <FlatButton label="Save Changes" onClick={this._saveChanges.bind(this)} />
      </div>
    );
  }

  _saveChanges() {
    const task = this.props.task;
    TasksDispatch({
      type: 'tasks/update',
      task: {
        id: task.id,
        name: this.refs[`taskName${task.id}`].getValue(),
        type: this.refs[`taskType${task.id}`].getValue(),
      }
    });
  }

  _doSaveChanges() {

  }

}

export default Container.create(TaskItem);
