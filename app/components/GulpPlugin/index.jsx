import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
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
      <div>
      <Paper zDepth={2}
            className={`pluginPaper`}
        >
        <h3>{this.props.name} <i>v{this.props.version}</i></h3>
        <h4>Author: {this.props.author}</h4>
        <p>{this.props.description}</p>
        <p><FlatButton label="Select" onClick={this.onPluginSelect.bind(this)} /></p>
        {
          this.props.keywords.map((keyword) => {
            return <i className={'keyword'}>{keyword}</i>;
          })
        }
      </Paper>
      <Divider />
      </div>
    );
  }
}
