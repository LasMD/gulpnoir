import React, { Component } from 'react';
import NavButton from '../../components/NavButton';
import '!style!css!sass!./_style.scss';

export default class WelcomePage extends Component {

  render() {
    return (
      <main className={'page-welcome'}>
        <h1>Welcome to GulpNoir</h1>
          <NavButton to={'home'}>Sign In</NavButton>
      </main>
    );
  }
}
