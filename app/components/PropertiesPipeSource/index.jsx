import React, { Component } from 'react';
import { GRID_CONST } from '../../constants';
import TextField from '../MutableTextField';
import Paper from 'material-ui/Paper';
import './_style.scss';

class PropertiesPipeSource extends Component {

  render() {
    let renderItem = (<div></div>);

    if (this.props.PipeSource) {
      renderItem = (
        <Paper className={`propertyPaper`}  zDepth={1}>
          <h3>
              {this.props.PipeSource.get('glob')}
          </h3>
        </Paper>
      )
    }

    return renderItem;
  }

}

export default PropertiesPipeSource;
