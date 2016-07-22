import React, { Component } from 'react';
import NavButton from '../../components/NavButton';
import { Button } from 'react-toolbox/lib/button';
import '!style!css!sass!./_style.scss';
import $ from 'jquery';

export default class HomePage extends Component {

  componentDidMount() {

    this.setState({addedPlugins: []});

    $.get('http://npmsearch.com/query?fields=name,keywords,rating,description,author,modified,homepage,version&q=keywords:gulpfriendly&q=keywords:gulpplugin&size=2756&sort=rating:desc',
    (result) => {
      let jsonResult = JSON.parse(result);
      this.setState({gulpPlugins: jsonResult});
      console.log(this.state.gulpPlugins);
    });
  }

  setAddedPlugins() {
    [].filter.call(this.gulpPluginsList, function (o) {
      return o.selected;
    }).map((o) => {
      this.setState({addedPlugins: this.state.addedPlugins.concat(this.state.gulpPlugins.results.splice(o.value, 1))});
      return true;
    });
  }

  getAddedPlugins() {
    if (this.state && this.state.addedPlugins) {
      return (this.state.addedPlugins.map(
        (result) => {
          return <option>{result.name[0]}</option>;
        }
      ));
    } else {
      return <option>{'None'}</option>;
    }
  }

  getGulpPlugins() {
    if (this.state && this.state.gulpPlugins) {
      return (this.state.gulpPlugins.results.map(
        (result, index) => {
          return <option value={index}>{result.name[0]}</option>;
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
        <select ref={ (ref) => this.gulpPluginsList = ref } multiple>
          {this.getGulpPlugins()}
        </select>
        <Button onClick={this.setAddedPlugins.bind(this)}>Add Plugin</Button>
        <select multiple>
          {this.getAddedPlugins()}
        </select>
        <br />
        <NavButton to={''}>Back</NavButton>
      </main>
    );
  }
}
