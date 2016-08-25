import React, { Component } from 'react';
import { GRID_CONST } from '../../constants';
import TextField from '../MutableTextField';

class PropertiesPipeSource extends Component {

  render() {
    let renderItem = (<div></div>);

    if (this.props.PipeSource) {
      renderItem = (
        <div>
          <h3>
              {this.props.PipeSource.get('name')}
          </h3>
        </div>
      )
    }

    return renderItem;
  }

}

export default PropertiesPipeSource;
