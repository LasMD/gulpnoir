import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import { DragSource } from 'react-dnd';
import { GRID_CONST } from '../../constants';
import IconContentLink from 'material-ui/svg-icons/content/link'
import { shell } from 'electron';
import IconButton from 'material-ui/IconButton';
import './_style.scss';

const cardSource = {
  beginDrag() {
    return {

    };
  },

  endDrag(props, monitor, component) {
    const result = monitor.getDropResult();
    if (!result) return;
    const { grid, position } = monitor.getDropResult();
    position.x -= GRID_CONST.ITEM.PLUGIN.size.width / 2;
    position.y -= GRID_CONST.ITEM.PLUGIN.size.height / 2;
    position.x = Math.floor(position.x / GRID_CONST.SNAP_SIZE) * GRID_CONST.SNAP_SIZE;
    position.y = Math.floor(position.y / GRID_CONST.SNAP_SIZE) * GRID_CONST.SNAP_SIZE;
    grid.createTask({ text: props.task.get('name'), id: props.task.get('id'), ...position });
    component.forceUpdate();
  }
};


function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}


class TaskDetailFull extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { connectDragSource, isDragging } = this.props;
    return connectDragSource(
      <div className={`pluginWrapper`}>
        <Paper
          zDepth={2}
          className={`pluginPaper`}>
        {this.props.task.get('name')}
        </Paper>
        <br />
      </div>
    );
  }
}

export default DragSource('GraphItems', cardSource, collect)(TaskDetailFull);
export { TaskDetailFull as Jest };
