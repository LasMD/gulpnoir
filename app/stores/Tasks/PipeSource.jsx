import Immutable from 'immutable';

const PipeSourceRecord = Immutable.Record({
  id: null,
  glob: null
});

export default class PipeSource extends PipeSourceRecord {
  constructor({
    glob
  }) {
    super({
      id: Date.now(),
      glob: glob
    });
  }
}
