import React, { Component } from 'react';
import { GRID_CONST } from '../../constants';
import TextField from '../MutableTextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import GulpPluginsChannels from '../../stores/GulpPlugins/GulpPluginsChannels';
import IconContentRemove from 'material-ui/svg-icons/content/remove-circle-outline';

class PropertiesGulpPlugin extends Component {

  constructor(props) {
    super(props);
    this.newParamValue = '';
  }

  pushNewParam() {
    let pluginObject = GulpPluginsChannels.getPluginObjectById(this.props.GulpPlugin.get('id'));
    let params = pluginObject.get('params');
    let newValue = this.refs.newParamInput.getValue();
    if (!newValue.match(/\w+/)) return;
    params = params.push(this.refs.newParamInput.getValue());
    this.newParamValue = '';
    pluginObject = pluginObject.set('params', params);
    GulpPluginsChannels.dispatch({
      channel: 'plugins/object/set',
      outgoing: {
        id: pluginObject.get('id'),
        plugin: pluginObject,
      }
    });
    this.forceUpdate();
  }

  removeParam(idx) {
    let params = this.props.GulpPlugin.get('params');
    params = params.splice(idx, 1);
    this.props.GulpPlugin.set('params', params);
    GulpPluginsChannels.dispatch({
      channel: 'plugins/object/set',
      outgoing: {
        id: this.props.GulpPlugin.get('id'),
        plugin: this.props.GulpPlugin
      }
    });
    this.forceUpdate();
  }

  render() {

    let pluginObject = GulpPluginsChannels.getPluginObjectById(this.props.GulpPlugin.get('id'));

    let renderItem = (<div></div>);
    let paramsList = [];

    pluginObject.get('params').map((param, idx) => {
      paramsList.push(<div key={`${pluginObject.get('name')}-param-${idx}`} className={`plugin-property-param`}>{param}<IconButton onClick={this.removeParam.bind(this, idx)}><IconContentRemove /></IconButton></div>);
    });

    if (!paramsList.length) {
      paramsList = (<div>Empty</div>);
    }

    if (this.props.GulpPlugin) {
      renderItem = (
        <Paper className={`propertyPaper`} zDepth={1}>
          <h2>Plugin Properties</h2>
          <h3>{this.props.GulpPlugin.get('name')}</h3>
          <b>Parameters:</b>
          {paramsList}
          <TextField
            ref={'newParamInput'}
            name={'newParam'}
            placeholder={`{raw: 'value'}`}
            value={this.newParamValue}
            />
          <FlatButton onClick={this.pushNewParam.bind(this, this.newParamValue)} label={`Add Parameter`} />
         </Paper>
      )
    }

    return renderItem;
  }

}

export default PropertiesGulpPlugin;
