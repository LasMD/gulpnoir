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
  params: null,
});

export default class GulpPlugin extends GulpPluginRecord {
  constructor({
    id,
    author,
    description,
    homepage,
    keywords,
    modified,
    name,
    rating,
    version,
    params = Immutable.List()
  }) {
    super({
      id,
      author: author,
      description: description,
      homepage: homepage,
      keywords: keywords,
      modified: null,
      name: name,
      rating: rating,
      version: version,
      params: params
    });
  }
}
