import Immutable from 'immutable';

const TaskItemRecord = Immutable.Record({
  id: null,
  name: null,
  gridAttrs: null,
  type: null,
  typeID: null,
});

export default class TaskItem extends TaskItemRecord {
  constructor({ name, type, typeID }) {
    super({
      id: Date.now(),
      name,
      gridAttrs: null,
      type,
      typeID,
    });
  }
}
