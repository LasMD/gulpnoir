import Immutable from 'immutable';
import { Channelizer } from 'channelizer';
import $ from 'jquery';

class GulpPluginsChannels extends Channelizer {

  Model() {
    $.get('http://npmsearch.com/query?fields=name,keywords,rating,description,author,modified,homepage,version&q=keywords:gulpfriendly&q=keywords:gulpplugin&size=20&sort=rating:desc',
    (result) => {
      const jsonResult = JSON.parse(result);
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

        receiver.tune({
          channel: 'new',
          controller: ({ state, incoming }) => this.ctrlNewPlugin({ state, incoming })
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

      }
    });
  }

  ctrlNewPlugin({ state, incoming }) {
    return state.setIn(['pluginObjects', incoming.id], incoming);
  }

  getInstalledPlugins() {
    return this.getState().get('installed');
  }

  getGulpPlugins() {
    return this.getState().get('plugins') || [];
  }

  getPluginObjectById(id) {
    return this.getState().getIn(['pluginObjects', id]);
  }

}

const instance = new GulpPluginsChannels();
export default instance;
