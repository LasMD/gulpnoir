import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Paper from 'material-ui/Paper';
import vstyles from './_style.scss';
import FlatButton from 'material-ui/FlatButton';
import { DragSource } from 'react-dnd';
import { GRID_CONST } from '../../constants';

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
    grid.createPlugin({text: props.name.replace(/gulp(_|\-)?/g, ""), ...position});
  }
};


function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}


class GulpPlugin extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentDidMount() {
    // gulpplugin is implied
    if (this.props.keywords.indexOf('gulpplugin') > -1) {
      this.props.keywords.splice(this.props.keywords.indexOf('gulpplugin'), 1);
    }
    if (this.props.reportHeight) {
      this.props.reportHeight({
          index: this.props.index,
          height: findDOMNode(this).offsetHeight
        });
    }
  }

  onPluginSelect() {
    this.props.onPluginSelect(this.props.index);
  }

  render() {
    const { connectDragSource, isDragging } = this.props;
    return connectDragSource(
      <div>
        <Paper zDepth={2}
              className={`pluginPaper`}
          >
          <h3>{this.props.name} <i>v{this.props.version}</i></h3>
          <h4>Author: {this.props.author}</h4>
          <p>{this.props.description}</p>
          <p><FlatButton label="Select" onClick={this.onPluginSelect.bind(this)} /></p>
          <p className={'keywords-wrapper'}>
          {
            this.props.keywords.map((keyword) => {
              return <i className={'keyword'}>{keyword}</i>;
            })
          }
          </p>
        </Paper>
    </div>
    );
  }
}

export default DragSource("GraphItems", cardSource, collect)(GulpPlugin);
