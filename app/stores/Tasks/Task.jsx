import Immutable from 'immutable';

const TaskRecord = Immutable.Record({
  id: null,
  name: null,
  type: null,
  graph: null,
  connections: null,
  export: null,
  items: null
});

export default class Task extends TaskRecord {
  constructor({ name, type, graph, connections, items = [] }) {
    super({
      id: Date.now(),
      name,
      type,
      graph: graph || '',
      connections: connections || '',
      export: null,
      items
    });
  }
}
