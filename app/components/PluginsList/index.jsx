import React, { Component } from 'react';
import { VirtualScroll, AutoSizer } from 'react-virtualized';
import GulpPlugin from '../GulpPlugin';
import Drawer from 'material-ui/Drawer';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import Divider from 'material-ui/Divider';
import GulpPluginsChannels from '../../stores/GulpPlugins/GulpPluginsChannels';
import { Container } from 'flux/utils';
import { List, ListItem } from 'material-ui/List';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import IconActionSearch from 'material-ui/svg-icons/action/search'
import TextField from '../MutableTextField';

import vstyles from '!style!css!react-virtualized/styles.css';

class PluginsList extends Component {

  static getStores() {
    return [ GulpPluginsChannels ];
  }

  static calculateState() {
    return {
      gulpPlugins: GulpPluginsChannels.getGulpPlugins(),
      installedPlugins: GulpPluginsChannels.getInstalledPlugins()
    };
  }

  componentDidMount() {
    this.setState({addedPlugins: []});
    this.pluginsHeights = {};
    this.pluginsRefs = {};
    this.pluginSearch = '';
  }

  getGulpPluginsResultsCount() {
    if (this.state && this.state.gulpPlugins) {
      if (this.state.gulpPluginsFiltered) {
        return this.state.gulpPluginsFiltered.length;
      } else {
        return this.state.gulpPlugins.length;
      }
    } else {
      return 0;
    }
  }

  addKeyword(keyword) {
    let pluginSearch = this.refs.pluginSearch.getValue();
    if (pluginSearch.length > 1 && pluginSearch.split(',').length > 0) {
      pluginSearch += `,${keyword}`;
    } else {
      pluginSearch += keyword;
    }
    this.setState({ pluginSearch }, () => {
      this.filterPluginResults();
    });
  }

  removeKeyword(keyword) {
    let pluginSearch = this.refs.pluginSearch.getValue();
    let pluginSearchArr = this.refs.pluginSearch.getValue().split(',');
    if (pluginSearchArr.indexOf(keyword) > -1) {
      pluginSearchArr.splice(pluginSearchArr.indexOf(keyword), 1);
    }
    pluginSearch = pluginSearchArr.join(',');
    this.setState({ pluginSearch }, () => {
      this.filterPluginResults();
    });
  }

  updatePluginHeight({index, height}) {
    this.pluginsHeights[`plugin-${index}`] = height;

    // The vscroll ref is assigned to autosizer
    // vscroll recomputeRowHeights calls recomputeGridSize and forceUpdate on
    // vscroll._grid. However, for some reason vscroll._grid is null for a split
    // when its children have rendered.
    setTimeout(() => this.refs.autosizer.refs.vscroll.recomputeRowHeights(index), 100);
  }

  onPluginSelect(index) {
    this.props.onPluginSelect(this.state.gulpPlugins[index]);
  }

  getGulpPluginListItem(index) {
    let plugin;
    if (this.state.gulpPluginsFiltered) {
      plugin = this.state.gulpPluginsFiltered[index];
    } else {
      plugin = this.state.gulpPlugins[index];
    }
    if (this.state.installedPlugins.get(plugin.name[0])) {
      plugin.installed = true;
    }
    return (
      <div>
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
          installed={plugin.installed}
          homepage={plugin.homepage[0]}
          search={(this.state.pluginSearch || '').split(',')}
          addKeyword={this.addKeyword.bind(this)}
          removeKeyword={this.removeKeyword.bind(this)}
        />
      </div>
    );
  }

  updateHeight(size) {
    // We're setting the height of the VirtualScroller to the height of the Tab
    // Minus 48 pixels for the height of the Tab Label Button
    this.refs['autosizer'].setHeight = size - 48;
    this.forceUpdate();
  }


  filterPluginResults() {
    let searchVals = this.refs.pluginSearch.getValue();
    searchVals = searchVals.split(',');
    // console.log(searchVals);
    this.setState({ pluginSearch: this.refs.pluginSearch.getValue() });
    if (!searchVals.length) {
      this.setState({ gulpPluginsFiltered: this.state.gulpPlugins });
      this.forceUpdate();
      return;
    }
    let gulpPluginsFiltered = this.state.gulpPlugins.filter(plugin => {

      let matchHash = {};

      for (let author of plugin.author) {
        let matches = 0;
        for (let searchVal of searchVals) {
          let regex = new RegExp(searchVal, "gi");
          if (author.match(regex)) {
            matchHash[searchVal]++;
            if (++matches >= searchVals.length) return plugin;
          }
        }
      }

      for (let name of plugin.name) {
        let matches = 0;
        for (let searchVal of searchVals) {
          let regex = new RegExp(searchVal, "gi");
          if (name.match(regex)) {
            matchHash[searchVal]++;
            if (++matches >= searchVals.length) return plugin;
          }
        }
      }

      let matches = 0;
      for (let keyword of plugin.keywords) {
        if (searchVals.indexOf(keyword) > -1) {
          matchHash[keyword]++;
          if (++matches >= searchVals.length) return plugin;
        }
      }

      // Check to see if at least each search val was matched once in any field
      let searchSet = Object.assign([], searchVals);
      matches = 0;
      for (let match of Object.keys(matchHash)) {
        if (searchSet.indexOf(match) > -1) {
          if (++matches >= searchVals.length) return plugin;
          searchSet.splice(searchSet.indexOf(match), 1);
        }
      }

      return false;

    });
    this.setState({ gulpPluginsFiltered });
    this.forceUpdate();
  }

  onKeyDown(event) {
    if (event.key == "Enter") {
      this.filterPluginResults();
    }
  }

  render() {
    return (
      <div className={'plugins-list'}>
        <Toolbar className={'Toolbar'}>
          <ToolbarGroup firstChild={true}>
            <ToolbarTitle className={'ToolbarTitle'} text="Gulp Plugins" />
          </ToolbarGroup>
          <ToolbarGroup>
            <MenuItem
              leftIcon={<IconActionSearch />}
              primaryText={
                <TextField
                  ref={'pluginSearch'}
                  name={'newParam'}
                  placeholder={`Search plugins...`}
                  value={this.state.pluginSearch}
                  onKeyDown={this.onKeyDown.bind(this)}
                />
              }
            />
          </ToolbarGroup>
        </Toolbar>
        <AutoSizer ref='autosizer' disableHeight>
        {
          ({width}) => (
            <VirtualScroll
              ref={'vscroll'}
              width={width}
              height={this.refs['autosizer'] ? (this.refs['autosizer'].setHeight || this.props.height - 48) : this.props.height - 48}
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
      </div>
    );
  }

}

export default Container.create(PluginsList);
