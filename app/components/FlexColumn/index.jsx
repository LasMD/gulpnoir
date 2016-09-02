// @flow
import React, { Component } from 'react';

export default class FlexColumn extends Component {

  render() {
    return (
      <div style={{ width: this.props.size || '100%' }} className={"flex-column"}>
        {this.props.children}
      </div>
    );
  }
}
