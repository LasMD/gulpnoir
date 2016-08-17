import React, { Component } from 'react';
import GulpPluginsChannels from '../../stores/GulpPlugins/GulpPluginsChannels';
import { ListItem } from 'material-ui/List';
import { Container } from 'flux/utils';
import DraggablePlugin from './DraggablePlugin';
import EditorLinearScale from 'material-ui/svg-icons/editor/linear-scale';
import './_style.scss';

class InstalledPluginsComponent extends Component {


  static getStores() {
    return [GulpPluginsChannels];
  }

  static calculateState(prevState) {
    return {
      installedPlugins: GulpPluginsChannels.getInstalledPlugins()
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      installedPlugins: GulpPluginsChannels.getInstalledPlugins()
    };
  }

  render() {
    let plugins;

    if (this.state.installedPlugins.size > 0) {
      plugins = [];
    }

    this.state.installedPlugins.map((plugin) => {
      plugins.push((
        <DraggablePlugin key={plugin.name + 'li'} plugin={plugin} />
      ));
    });



    return (
      <ListItem
        key={2}
        primaryText="Plugins"
        primaryTogglesNestedList={true}
        nestedItems={plugins}
        leftIcon={<EditorLinearScale />}
      />
    );
  }
}

export default Container.create(InstalledPluginsComponent);
