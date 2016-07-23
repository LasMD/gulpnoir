import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';

export default class NavButton extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  doNav(options) {
    this.context.router.push(options.href);
  }

  render() {
    return (
      <FlatButton onClick={this.doNav.bind(this, { href: this.props.to })}>
        {this.props.children}
      </FlatButton>
    );
  }
}
