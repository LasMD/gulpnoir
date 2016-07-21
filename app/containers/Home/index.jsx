import React, { Component } from 'react';
import NavButton from '../../components/NavButton';
import '!style!css!sass!./_style.scss';
import $ from 'jquery';

export default class HomePage extends Component {

  componentDidMount() {
    $.get('http://npmsearch.com/query?fields=name,keywords,rating,description,author,modified,homepage,version&q=keywords:gulpfriendly&q=keywords:gulpplugin&size=2756&sort=rating:desc',
    (result) => {
      let jsonResult = JSON.parse(result);
      this.setState({gulpPlugins: jsonResult});
      console.log(this.state.gulpPlugins);
    });
  }

  getGulpPlugins() {
    if (this.state && this.state.gulpPlugins) {
      return (this.state.gulpPlugins.results.map(
        (result) => {
          return <option>{result.name[0]}</option>;
        }
      ));
    } else {
      return <option>{'Result'}</option>;
    }
  }

  render() {
    return (
      <main>
        <h1>Testing</h1>
        <select multiple>
          {this.getGulpPlugins()}
        </select>
        <br />
        <NavButton to={''}>Back</NavButton>
      </main>
    );
  }
}
