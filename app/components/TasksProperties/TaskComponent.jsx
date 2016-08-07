import React, { Component } from 'react';
import { RadioButton } from 'material-ui/RadioButton';
import TextField from '../MutableTextField';
import RadioButtonGroup from '../MutableRadioButtonGroup';
import FlatButton from 'material-ui/FlatButton';
import { Container } from 'flux/utils';

import TasksChannels from '../../stores/Tasks/TasksChannels';

class TaskComponent extends Component {

  static getStores() {
    return [TasksChannels];
  }

  static calculateState() {
    return {
      tasks: TasksChannels.getTasks()
    };
  }

  render() {
    const task = this.props.task;
    if (this.refs[`taskName${task.get('id')}`]) {
      this.refs[`taskName${task.get('id')}`].forceUpdate();
    }
    return (
      <div>
        <h3><b>{task.get('name')}</b> <i>({task.get('type')})</i></h3>
        <FlatButton label="Save Changes" onClick={this._saveChanges.bind(this)} />
      </div>
    );
  }

  _saveChanges() {
    const task = this.props.task;
    TasksChannels.dispatch({
      channel: 'tasks/update',
      outgoing: {
        task: {
          id: task.get('id'),
          name: this.refs[`taskName${task.get('id')}`].getValue(),
          type: this.refs[`taskType${task.get('id')}`].getValue(),
        }
      }
    });
  }

  _doSaveChanges() {

  }

}

export default Container.create(TaskComponent);
