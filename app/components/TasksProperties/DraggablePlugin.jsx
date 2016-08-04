import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { GRID_CONST } from '../../constants';
import { List, ListItem } from 'material-ui/List';
import './_style.scss';

const cardSource = {
  beginDrag() {
    return {

    }
  },

  endDrag(props, monitor, component) {
    let result = monitor.getDropResult();
    if (!result) return;
    let { grid, position } = monitor.getDropResult();
    position.x -= GRID_CONST.ITEM.PLUGIN.size.width / 2;
    position.y -= GRID_CONST.ITEM.PLUGIN.size.height / 2;
    position.x = Math.floor(position.x / GRID_CONST.SNAP_SIZE) * GRID_CONST.SNAP_SIZE;
    position.y = Math.floor(position.y / GRID_CONST.SNAP_SIZE) * GRID_CONST.SNAP_SIZE;
    grid.createPlugin({text: props.plugin.name.replace(/gulp(_|\-)?/g, ""), ...position});
  }
};


function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class DraggablePlugin extends Component {
  render() {
    const { connectDragSource, isDragging } = this.props;
    return connectDragSource(
      <div>
        <ListItem primaryText={this.props.plugin.name} />
      </div>
    );
  }
}

export default DragSource("GraphItems", cardSource, collect)(DraggablePlugin);
