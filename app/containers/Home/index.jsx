import React, { Component } from 'react';
import NavButton from '../../components/NavButton';
import '!style!css!sass!./_style.scss';

export default class HomePage extends Component {
  render() {
    return (
      <main>
        <h1>Testing</h1>
        <br />
        <NavButton to={''}>Back</NavButton>
      </main>
    );
  }
}
