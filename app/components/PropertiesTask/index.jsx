import React, { Component } from 'react';
import { RadioButton } from 'material-ui/RadioButton';
import TextField from '../MutableTextField';
import RadioButtonGroup from '../MutableRadioButtonGroup';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import { Container } from 'flux/utils';
import TasksChannels from '../../stores/Tasks/TasksChannels';

class PropertiesTask extends Component {

  static getStores() {
    return [TasksChannels];
  }

  static calculateState() {
    return {
      tasks: TasksChannels.getTasks()
    };
  }

  getInitialState() {
    return {
      editingTask: false
    };
  }

  editName() {
    this.setState({editingTask: true});
  }

  updateName() {
    TasksChannels.dispatch({
      channel: 'tasks/update',
      outgoing: {
        task: {
          id: this.props.task.get('id'),
          name: this.refs['newName'].getValue()
        },
      }
    });
    this.setState({
      editingTask: false
    });
  }

  render() {
    const task = this.props.task;
    if (this.refs[`taskName${task.get('id')}`]) {
      this.refs[`taskName${task.get('id')}`].forceUpdate();
    }

    this.newName = task.get('name');

    return (
      <Paper className={`propertyPaper`} zDepth={1}>
        <h2>Task Properties</h2>
        <h3>
          {
              this.state.editingTask ? <TextField ref={'newName'} value={this.newName} placeholder={`Enter a task name...`} />
              : <b onDoubleClick={this.editName.bind(this)}>{task.get('name')}</b>
          }
          <i>({task.get('type')})</i>
        </h3>
        { this.state.editingTask ? <FlatButton onClick={this.updateName.bind(this)} label={`Update`} /> : '' }
      </Paper>
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

export default Container.create(PropertiesTask);
