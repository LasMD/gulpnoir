import React, { Component } from 'react';
import { RadioButton } from 'material-ui/RadioButton';
import TextField from '../MutableTextField';
import RadioButtonGroup from '../MutableRadioButtonGroup';
import FlatButton from 'material-ui/FlatButton';
import { Container } from 'flux/utils';

import { TasksDispatch } from '../../store/Tasks/TasksDispatcher';
import TasksStore from '../../store/Tasks/TasksStore.jsx';

class PropertiesItem extends Component {

  static getStores() {
    return [TasksStore];
  }

  static calculateState() {
    return {
      taskitems: TasksStore.getTaskItems()
    };
  }

  render() {
    const TaskItem = this.state.taskitems.getIn([this.props.taskID], this.props.taskitem.id);
    return (
      <div>
        {{ TaskItem.name }}
        {{ TaskItem.type }}
      </div>
    );
  }

  _saveChanges() {
    const task = this.props.task;
    TasksDispatch({
      type: 'tasks/items/update',
      task: {
        id: task.id,
        name: this.refs[`taskName${task.id}`].getValue(),
        type: this.refs[`taskType${task.id}`].getValue(),
      }
    });
  }

}

export default Container.create(TaskComponent);
