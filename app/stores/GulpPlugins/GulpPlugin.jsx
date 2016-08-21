import Immutable from 'immutable';

const GulpPluginRecord = Immutable.Record({
  id: null,
  author: null,
  description: null,
  homepage: null,
  keywords: null,
  modified: null,
  name: null,
  rating: null,
  version: null,
  installed: null
});

export default class GulpPlugin extends GulpPluginRecord {
  constructor({
    author,
    description,
    homepage,
    keywords,
    modified,
    name,
    rating,
    version
  }) {
    super({
      author: author,
      description: null,
      homepage: null,
      keywords: null,
      modified: null,
      name: null,
      rating: null,
      version: null,
      installed: false
    });
  }
}
