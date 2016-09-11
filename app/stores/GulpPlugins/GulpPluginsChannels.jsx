import Immutable from 'immutable';
import { Channelizer } from 'channelizer';
import $ from 'jquery';
import GulpPlugin from './GulpPlugin';
import TasksChannels from '../Tasks/TasksChannels';

class GulpPluginsChannels extends Channelizer {

  Model() {
    $.get('http://npmsearch.com/query?fields=name,keywords,rating,description,author,modified,homepage,version&q=keywords:gulpfriendly&q=keywords:gulpplugin&size=9001&sort=rating:desc',
    (result) => {
      let jsonResult = JSON.parse(result);
      for (let plugin of jsonResult.results) {
        if (plugin.keywords.indexOf('gulp') > -1) {
          plugin.keywords.splice(plugin.keywords.indexOf('gulp'), 1);
        }
        if (plugin.keywords.indexOf('gulpplugin') > -1) {
          plugin.keywords.splice(plugin.keywords.indexOf('gulpplugin'), 1);
        }
        if (plugin.keywords.indexOf('gulp-plugin') > -1) {
          plugin.keywords.splice(plugin.keywords.indexOf('gulp-plugin'), 1);
        }
      }
      this.dispatch({
        channel: 'plugins/set',
        outgoing: {
          gulpPlugins: jsonResult
        }
      });
    });
    return Immutable.Map()
    .set('installed', Immutable.Map())
    .set('pluginObjects', Immutable.Map());
  }

  Channels({ receiver }) {

    receiver.world({
      prefix: 'plugins/',
      controller: ({ receiver }) => {

        receiver.world({
          prefix: 'object/',
          controller: ({ receiver }) => {

            receiver.tune({
              channel: 'new',
              controller: ({ state, incoming }) => this.ctrlNewPlugin({ state, incoming })
            });

            receiver.tune({
              channel: 'set',
              controller: ({ state, incoming }) => state.setIn(['pluginObjects', incoming.id], incoming.plugin)
            });

            receiver.tune({
              channel: 'setAll',
              controller: ({ state, incoming }) => state.set('pluginObjects', incoming.pluginObjects)
            });

          }
        });

        receiver.tune({
          channel: 'set',
          controller: ({ state, incoming }) => state.set('plugins', incoming.gulpPlugins.results)
        });

        receiver.tune({
          channel: 'installed/set',
          controller: ({ state, incoming }) => state.set('installed', incoming.installed)
        });

        receiver.tune({
          channel: 'install',
          controller: ({ state, incoming }) => state.set('installed',
            state.get('installed').set(incoming.plugin.name, incoming.plugin)
          )
        });

        receiver.tune({
          channel: 'uninstall',
          controller: ({ state, incoming }) => state.set('installed',
            state.get('installed').deleteIn([incoming.plugin.name])
          )
        });

      }
    });
  }

  validateUninstall({ name }) {
    let tasks = TasksChannels.getTasks('Functional');
    for (let task of tasks) {
      let { graphCellPluginIdMap } = task[1].get('export')('raw');

      for (let mapped of graphCellPluginIdMap) {

        let pluginId = mapped[1];

        let pluginObj = this.getPluginObjectById(pluginId);
        if (!pluginObj) continue;
        
        if (pluginObj.get('name') == name) return false;
      }
    }
    return true;
  }

  doUninstallPlugin({ name }) {
    if (!this.validateUninstall({ name })) return false;

    this.dispatch({
      channel: "plugins/uninstall",
      outgoing: {
        plugin: {
          name: name
        }
      }
    });

    return true;
  }

  ctrlNewPlugin({ state, incoming }) {
    let pluginObject = new GulpPlugin({id: incoming.id, ...incoming});
    return state.setIn(['pluginObjects', incoming.id], pluginObject);
  }

  getInstalledPlugins() {
    return this.getState().get('installed');
  }

  getGulpPlugins() {
    return this.getState().get('plugins') || [];
  }

  getGulpPluginObjects() {
    return this.getState().get('pluginObjects');
  }

  getPluginObjectById(id) {
    return this.getState().getIn(['pluginObjects', id]);
  }

}

const instance = new GulpPluginsChannels();
export default instance;
