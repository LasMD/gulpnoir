import React, { Component } from 'react';

import { TasksDispatch } from './TasksDispatcher.jsx';

export default class TaskItem extends Component {
  render() {
    const { task } = this.props;
    return (
      <div>
        <h2>{task.name}</h2>
      </div>
    );
  }
}
