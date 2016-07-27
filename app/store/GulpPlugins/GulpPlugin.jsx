import Immutable from 'immutable';

const GulpPluginRecord = Immutable.Record({
  id: null,
  name: null,
  version: null
});

export default class GulpPlugin extends GulpPluginRecord {
  constructor({name, version}) {
    super({
      id: Date.now(),
      name,
      version
    });
  }
}
