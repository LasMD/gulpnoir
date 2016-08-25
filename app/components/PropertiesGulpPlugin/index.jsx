import React, { Component } from 'react';
import { GRID_CONST } from '../../constants';
import TextField from '../MutableTextField';

class PropertiesGulpPlugin extends Component {

  render() {
    let renderItem = (<div></div>);

    if (this.props.GulpPlugin) {
      renderItem = (
        <div>
          <h3>
              {this.props.GulpPlugin.get('name')}
          </h3>
        </div>
      )
    }

    return renderItem;
  }

}

export default PropertiesGulpPlugin;
