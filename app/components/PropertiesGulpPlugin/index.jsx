import React, { Component } from 'react';
import { GRID_CONST } from '../../constants';
import TextField from '../MutableTextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import GulpPluginsChannels from '../../stores/GulpPlugins/GulpPluginsChannels';
import './_style.scss';

class PropertiesGulpPlugin extends Component {

  constructor(props) {
    super(props);
    this.newParamValue = '';
  }

  pushNewParam(a, b, c) {
    let params = this.props.GulpPlugin.get('params');
    params.push(this.refs.newParamInput.getValue());
    this.newParamValue = '';
    this.props.GulpPlugin.set('params', params);
    GulpPluginsChannels.dispatch({
      channel: 'plugins/object/set',
      outgoing: {
        id: this.props.GulpPlugin.get('id'),
        plugin: this.props.GulpPlugin,
      }
    });
    this.forceUpdate();
  }

  render() {


    let renderItem = (<div></div>);
    let paramsList = this.props.GulpPlugin.get('params').map((param, idx) => {
      return <div key={`${this.props.GulpPlugin.get('name')}-param-${idx}`}>{param}</div>;
    });

    if (!paramsList.length) {
      paramsList = (<div>Empty</div>);
    }

    console.log(this.props.task);
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
