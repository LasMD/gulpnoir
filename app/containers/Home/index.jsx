import React, { Component } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import NavButton from '../../components/NavButton';
import FlatButton from 'material-ui/FlatButton';
import './_style.scss';
import $ from 'jquery';
import { VirtualScroll, AutoSizer } from 'react-virtualized';

export default class HomePage extends Component {

  componentDidMount() {

    this.setState({addedPlugins: []});
    this.setState({gulpTasks: []});
    this.pluginsRefs = {};

    $.get('http://npmsearch.com/query?fields=name,keywords,rating,description,author,modified,homepage,version&q=keywords:gulpfriendly&q=keywords:gulpplugin&size=255&sort=rating:desc',
    (result) => {
      let jsonResult = JSON.parse(result);
      this.setState({gulpPlugins: jsonResult});
      console.log(this.state.gulpPlugins);
    });
  }

  getGulpTasks() {
    if (this.state && this.state.gulpTasks && this.state.gulpTasks.length > 0) {
      return (this.state.gulpTasks.map(
        (result) => <option>{result.name[0]}</option>
      ));
    } else {
      return <option>{'None'}</option>;
    }
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
    if (this.state && this.state.addedPlugins && this.state.addedPlugins.length > 0) {
      return (this.state.addedPlugins.map(
        (result) => <option>{result.name[0]}</option>
      ));
    } else {
      return <option>{'None'}</option>;
    }
  }

  getGulpPlugins() {
    if (this.state && this.state.gulpPlugins) {
      return this.state.gulpPlugin;
    } else {
      return {};
    }
  }

  getGulpPluginsResultsCount() {
    if (this.state && this.state.gulpPlugins) {
      return this.state.gulpPlugins.results.length;
    } else {
      return 0;
    }
  }

  getGulpPluginListItem(index) {
    if (this.state && this.state.gulpPlugins) {
      return <div id={'shadow-plugin-' + index}>{this.state.gulpPlugins.results[index].name[0]}</div>;
    } else {
      return <div id={'shadow-plugin-' + index}></div>;
    }
  }

  getGulpPluginListItemHeight({index}) {
    let component = render(this.getGulpPluginListItem(index), document.getElementById('shadow'));
    let height = component.offsetHeight;
    console.log(height);
    unmountComponentAtNode(component);
    component = null;
    return height;
  }

  render() {
    return (
      <main>
        <div style={{
            opacity: '0',
            position: 'absolute'
          }} id={'shadow'}>
        </div>
        <h1>Testing</h1>
        <br />
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around' }}>
            <h2>Plugins</h2>
            <AutoSizer disableHeight>
              {
                ({ width }) => (
                  <VirtualScroll
                    width={300}
                    height={300}
                    rowCount={this.getGulpPluginsResultsCount()}
                    rowRenderer={
                      ({ index }) => this.getGulpPluginListItem(index) // Could also be a DOM element
                    }
                    rowHeight={this.getGulpPluginListItemHeight.bind(this)}
                    overscanRowCount={0}
                  />
                )
              }
            </AutoSizer>
            <FlatButton onClick={this.setAddedPlugins.bind(this)}>Add Plugin</FlatButton>
          </div>
          <div style={{ display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around' }}>
            <h2>Tasks</h2>
            <select ref={ (ref) => this.gulpTasks = ref }>
              {this.getGulpTasks()}
            </select>
            <FlatButton>Create Task</FlatButton>
          </div>
          <div style={{ display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around' }}>
            <h2>Added Plugins</h2>
            <select multiple>
              {this.getAddedPlugins()}
            </select>
          </div>
        </div>
        <br />
        <NavButton to={''}>Back</NavButton>
      </main>
    );
  }
}
