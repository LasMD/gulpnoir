import React, { Component } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import NavButton from '../../components/NavButton';
import GulpPlugin from '../../components/GulpPlugin';
import FlatButton from 'material-ui/FlatButton';
import $ from 'jquery';
import { VirtualScroll, AutoSizer } from 'react-virtualized';
import vstyles from 'react-virtualized/styles.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './_style.scss';

export default class HomePage extends Component {

  componentDidMount() {

    this.setState({addedPlugins: []});
    this.setState({gulpTasks: []});
    this.pluginsHeights = {};
    this.pluginsRefs = {};

    $.get('http://npmsearch.com/query?fields=name,keywords,rating,description,author,modified,homepage,version&q=keywords:gulpfriendly&q=keywords:gulpplugin&size=2&sort=rating:desc',
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

  updatePluginHeight({index, height}) {
    console.log("updating", index, height);
    this.pluginsHeights[`plugin-${index}`] = height;
    this['plugin-vscroll'].recomputeRowHeights();
  }

  getGulpPluginListItem(index) {
    let plugin = this.state.gulpPlugins.results[index];
    return (
      <GulpPlugin
        index={index}
        name={plugin.name[0]}
        version={plugin.version[0]}
        description={plugin.description[0]}
        ref={(elem) => {this.pluginsRefs[`plugin-${index}`] = elem;}}
        reportHeight={this.updatePluginHeight.bind(this)}
      />
    );
  }

  render() {
    return (
      <main>
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
                  ({width}) => (
                    <VirtualScroll
                      ref={(elem) => {
                        if (!this['plugin-vscroll']) {
                          this['plugin-vscroll'] = elem;
                        }
                      }}
                      width={300}
                      height={300}
                      className={vstyles.VirtualScroll}
                      rowCount={this.getGulpPluginsResultsCount()}
                      rowRenderer={
                        ({ index }) => this.getGulpPluginListItem(index)
                      }
                      rowHeight={({index}) => this.pluginsHeights[`plugin-${index}`] || 100 }
                      overscanRowCount={3}
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
