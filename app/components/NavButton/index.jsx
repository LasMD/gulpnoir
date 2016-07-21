import React, { Component } from 'react';
import { Button } from 'react-toolbox/lib/button';

export default class NavButton extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  doNav(options) {
    this.context.router.push(options.href);
  }

  render() {
    return (
      <Button onClick={this.doNav.bind(this, { href: this.props.to })}>
        {this.props.children}
      </Button>
    );
  }
}
