import React, { Component } from 'react';
import { GulpPluginsDispatch } from '../../store/GulpPlugins/GulpPluginsDispatcher';
import GulpPluginsStore from '../../store/GulpPlugins/GulpPluginsStore';
import { List, ListItem } from 'material-ui/List';
import { Container } from 'flux/utils';
import { DragSource } from 'react-dnd';
import DraggablePlugin from './DraggablePlugin';
import './_style.scss';

class InstalledPluginsComponent extends Component {


  static getStores() {
    return [GulpPluginsStore];
  }

  static calculateState(prevState) {
    return {
      installedPlugins: GulpPluginsStore.getInstalledPlugins()
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      installedPlugins: GulpPluginsStore.getInstalledPlugins()
    };
  }

  render() {

    let plugins;

    if (this.state.installedPlugins.size > 0) {
      plugins = [];
    }

    this.state.installedPlugins.map((plugin) => {
      plugins.push((
        <DraggablePlugin plugin={plugin} />
      ));
    });



    return (
      <ListItem
        key={2}
        primaryText="Plugins"
        primaryTogglesNestedList={true}
        nestedItems={plugins}
        />
    );
  }

  openTask(id) {
    TasksDispatch({
      type: 'tasks/open',
      task: {
        id: id
      }
    });
  }

}

export default Container.create(InstalledPluginsComponent);
