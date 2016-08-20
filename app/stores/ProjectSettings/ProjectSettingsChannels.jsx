import { Channelizer } from 'channelizer';
import Immutable from 'immutable';

class ProjectSettingsChannels extends Channelizer {

  Model() {
    return Immutable.Map();
  }

  Channels({ receiver }) {

    receiver.tune({
      channel: 'set',
      controller: ({ state, incoming }) => return state.setIn(incoming.key, incoming.value)
    });

  }

}
const instance = new TasksChannels();
export default instance;
