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
      gulpPlugins: GulpPluginsChannels.getGulpPlugins()
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
    if (GulpPluginsChannels.getInstalledPlugins().get(plugin.name[0])) {
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

  onKeyDown(event) {
    if (event.key == "Enter") {
      let searchVal = this.refs.pluginSearch.getValue();
      searchVal = searchVal.replace(/s+/g,'|');
      this.setState({ pluginSearch: this.refs.pluginSearch.getValue() });
      let gulpPluginsFiltered = this.state.gulpPlugins.filter(plugin => {
        let inName = false;
        let inAuthor = false;
        let inKeywords = false;

        for (let author of plugin.author) {
          let regex = new RegExp(searchVal, "gi");
          if (author.match(regex) !== null) {
            inAuthor = true;
            break;
          }
        }
        for (let name of plugin.name) {
          let regex = new RegExp(searchVal, "gi");
          if (name.match(regex) !== null) {
            inName = true;
            break;
          }
        }
        for (let keywords of plugin.keywords) {
          let regex = new RegExp(searchVal, "gi");
          if (keywords.match(regex) !== null) {
            inKeywords = true;
            break;
          }
        }

        if (inAuthor || inName || inKeywords) {
          return plugin
        }

        return false;

      });
      this.setState({ gulpPluginsFiltered });
      this.forceUpdate();
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
