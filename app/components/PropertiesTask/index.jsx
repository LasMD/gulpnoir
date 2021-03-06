import React, { Component } from 'react';
import { RadioButton } from 'material-ui/RadioButton';
import TextField from '../MutableTextField';
import RadioButtonGroup from '../MutableRadioButtonGroup';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import { Container } from 'flux/utils';
import TasksChannels from '../../stores/Tasks/TasksChannels';
import IconActionDeleteForever from 'material-ui/svg-icons/action/delete-forever'
import IconButton from 'material-ui/IconButton';


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
      editingTask: false,
      newNameError: ''
    };
  }

  editName() {
    this.setState({editingTask: true});
  }

  updateName() {
    if (this.state.newNameError.length) return;
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

  onChangeNewName(event) {
    if (event.target.value.match(/\W/)) {
      this.setState({
        newNameError: 'Only use word characters [A-z,0-9,_]'
      });
    } else {
      this.setState({
        newNameError: ''
      });
    }
  }

  render() {
    const task = this.props.task;
    if (this.refs[`taskName${task.get('id')}`]) {
      this.refs[`taskName${task.get('id')}`].forceUpdate();
    }

    this.newName = task.get('name');

    return (
      <Paper className={`propertyPaper`} zDepth={1}>
        <div className={`header`}><h2 className={`title`}>Task Properties</h2><IconButton tooltip="Delete Task" onClick={this.deleteTask.bind(this)}><IconActionDeleteForever /></IconButton></div>
        <h3>
          {
              this.state.editingTask ? <TextField onChange={this.onChangeNewName.bind(this)} errorText={this.state.newNameError} ref={'newName'} value={this.newName} placeholder={`Enter a task name...`} />
            : <b onDoubleClick={this.editName.bind(this)}>{task.get('name')}</b>
          }
          <i>({task.get('type')})</i>
        </h3>
        { this.state.editingTask ?
          <span><FlatButton onClick={this.updateName.bind(this)} label={`Update`} /><FlatButton onClick={this.setState.bind(this, {editingTask: false})} label={`Cancel`} /></span>
          : '' }
        <br />
      </Paper>
    );
  }

  deleteTask() {
    if (TasksChannels.doDeleteTask({ id: this.props.task.get('id') })) {
      console.log('Delete initiated');
    } else {
      console.log('Failed');
    }
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
