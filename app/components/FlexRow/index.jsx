import React, { Component } from 'react';
import './_style.scss';

export default class FlexRow extends Component {

  render() {
    return (
      <div style={{width: this.props.size || '100%'}} className='flex-row'>
        {this.props.children}
      </div>
    );
  }
}
