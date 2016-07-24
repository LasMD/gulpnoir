import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Paper from 'material-ui/Paper';
import vstyles from './_style.scss';
import FlatButton from 'material-ui/FlatButton';

export default class GulpPlugin extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentDidMount() {
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
    return (
      <Paper zDepth={2}
            className={`pluginPaper`}
        >
        <h3>{this.props.name} <i>{this.props.version}</i></h3>
        <p>{this.props.description}</p>
        <p><FlatButton label="Select" onClick={this.onPluginSelect.bind(this)} /></p>
      </Paper>
    );
  }
}
