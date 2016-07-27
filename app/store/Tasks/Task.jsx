import Immutable from 'immutable';

const TaskRecord = Immutable.Record({
  id: null,
  name: null,
  type: null,
  items: null
});

export default class Task extends TaskRecord {
  constructor({ name, type }) {
    super({
      id: Date.now(),
      name,
      type,
      items: []
    });
  }
}
