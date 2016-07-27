import React, { Component } from 'react';
import { VirtualScroll, AutoSizer } from 'react-virtualized';
import GulpPlugin from '../../components/GulpPlugin';
import Drawer from 'material-ui/Drawer';
import {Tabs, Tab} from 'material-ui/Tabs';

import vstyles from './_style.scss';

export default class PluginsList extends Component {

  componentDidMount() {
    this.setState({addedPlugins: []});
    this.pluginsHeights = {};
    this.pluginsRefs = {};
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
    this.pluginsHeights[`plugin-${index}`] = height;

    // The vscroll ref is assigned to autosizer
    // vscroll recomputeRowHeights calls recomputeGridSize and forceUpdate on
    // vscroll._grid. However, for some reason vscroll._grid is null for a split
    // when its children have rendered.
    setTimeout(() => {
      this.refs.autosizer.refs.vscroll.recomputeRowHeights(index);
    }, 100);
  }

  onPluginSelect(index) {
    this.props.onPluginSelect(this.state.gulpPlugins.results[index]);
  }

  getGulpPluginListItem(index) {
    let plugin = this.state.gulpPlugins.results[index];
    return (
      <GulpPlugin
        index={index}
        name={plugin.name[0]}
        author={plugin.author[0]}
        version={plugin.version[0]}
        description={plugin.description[0]}
        keywords={plugin.keywords}
        ref={(elem) => {this.pluginsRefs[`plugin-${index}`] = elem;}}
        reportHeight={this.updatePluginHeight.bind(this)}
        onPluginSelect={this.onPluginSelect.bind(this)}
      />
    );
  }

  render() {
    return (
      <Tabs className={'plugins-list'}>
        <Tab label="Browse Plugins">
          <AutoSizer ref='autosizer' disableHeight>
            {
              ({width}) => (
                <VirtualScroll
                  ref={'vscroll'}
                  width={width}
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
          </Tab>
          <Tab label="Installed Plugins">
          </Tab>
        </Tabs>
    );
  }

}
