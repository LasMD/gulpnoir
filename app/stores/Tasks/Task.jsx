import Immutable from 'immutable';

const TaskRecord = Immutable.Record({
  id: null,
  name: null,
  type: null,
  graph: null,
  exportGraph: null,
  exportConnections: null,
  items: null
});

export default class Task extends TaskRecord {
  constructor({ name, type, graph }) {
    super({
      id: Date.now(),
      name,
      type,
      graph: graph || '',
      exportGraph: null,
      exportConnections: null,
      items: []
    });
  }
}
