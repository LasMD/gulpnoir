import Immutable from 'immutable';

const PipeSourceRecord = Immutable.Record({
  id: null,
  glob: null,
  dest: null
});

export default class PipeSource extends PipeSourceRecord {
  constructor({
    glob,
    dest
  }) {
    super({
      id: Date.now(),
      glob: glob,
      dest: dest
    });
  }
}
