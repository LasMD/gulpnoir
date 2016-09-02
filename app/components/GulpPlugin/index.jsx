import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import { DragSource } from 'react-dnd';
import { GRID_CONST } from '../../constants';
import GulpPluginsChannels from '../../stores/GulpPlugins/GulpPluginsChannels';
import IconContentLink from 'material-ui/svg-icons/content/link'
import { shell } from 'electron';
import IconButton from 'material-ui/IconButton';

const cardSource = {
  beginDrag() {
    return {

    };
  },

  endDrag(props, monitor, component) {
    let pluginId = Date.now();
    GulpPluginsChannels.dispatch({
      channel: 'plugins/object/new',
      outgoing: {
        id: pluginId,
        ...component.props
      }
    });
    const result = monitor.getDropResult();
    if (!result) return;
    const { grid, position } = monitor.getDropResult();
    position.x -= GRID_CONST.ITEM.PLUGIN.size.width / 2;
    position.y -= GRID_CONST.ITEM.PLUGIN.size.height / 2;
    position.x = Math.floor(position.x / GRID_CONST.SNAP_SIZE) * GRID_CONST.SNAP_SIZE;
    position.y = Math.floor(position.y / GRID_CONST.SNAP_SIZE) * GRID_CONST.SNAP_SIZE;
    grid.createPlugin({ text: props.name.replace(/gulp(_|\-)?/g, ''), id: pluginId, ...position });
    GulpPluginsChannels.dispatch({
      channel: 'plugins/install',
      outgoing: {
        plugin: props
      }
    });
    component.state.installed = true;
    component.forceUpdate();
  }
};


function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}


class GulpPlugin extends Component {

  constructor(props) {
    super(props);
    this.state = {};
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

  onPluginInstall() {
    GulpPluginsChannels.dispatch({
      channel: 'plugins/install',
      outgoing: {
        plugin: this.props
      }
    });
    this.state.installed = true;
    this.forceUpdate();
  }
  onPluginUninstall() {
    this.props.onPluginSelect(this.props.index);
  }

  openHomePage() {
    shell.openExternal(this.props.homepage);
    return false;
  }

  render() {
    const { connectDragSource, isDragging } = this.props;
    return connectDragSource(
      <div className={`pluginWrapper`}>
      <div style={(this.props.installed || this.state.installed) ? {backgroundColor: 'limegreen'} : {}}>
        <Paper
          zDepth={2}
          className={`pluginPaper`}
          style={(this.props.installed || this.state.installed) ? {opacity: '0.75'} : {}}>
          <div className={`header`}>
            <h2 className={`title`}>{this.props.name} <i>v{this.props.version}</i>&nbsp;<IconButton onClick={this.openHomePage.bind(this)}><IconContentLink /></IconButton></h2>
              {
                (this.props.installed || this.state.installed) ?
                <FlatButton label={'Uninstall'} onClick={this.onPluginUninstall.bind(this)}  />
                :
                <FlatButton label={'Install'} onClick={this.onPluginInstall.bind(this)} />
              }
          </div>
          <h3 className={`author`}>Author:</h3> {this.props.author}
          <p className={`description`}>{this.props.description}</p>
          <p className={'keywords-wrapper'}>
          {
            this.props.keywords.map((keyword, index) => {
              return <i
                key={index}
                style={(this.props.search.indexOf(keyword) > -1) ? {backgroundColor: 'limegreen'} : {}}
                className={'keyword'}>{keyword}</i>;
            })
          }
          </p>
        </Paper>
      </div>
      <br />
    </div>
    );
  }
}

export default DragSource('GraphItems', cardSource, collect)(GulpPlugin);
export { GulpPlugin as Jest };
