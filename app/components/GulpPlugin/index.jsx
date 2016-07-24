import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Paper from 'material-ui/Paper';

export default class GulpPlugin extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentDidMount() {
    if (this.props.reportHeight) {
      this.props.reportHeight({
          index: this.props.index,
          height: findDOMNode(this.refs['main-cont']).offsetHeight
        });
    }
  }

  render() {
    return (
      <Paper zDepth={2}
            className={`pluginPaper`}
            ref={'main-cont'}
        >
        <h3>{this.props.name} <i>{this.props.version}</i></h3>
        <p>{this.props.description}</p>
      </Paper>
    );
  }
}
