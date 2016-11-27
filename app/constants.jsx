export default {
  GRID_CONST: {
    SNAP_SIZE: 15,
    ITEM: {
      PLUGIN: {
        size: {
          width: 80,
          height: 80
        },
        attrs: {
          rect: { fill: 'orange' },
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' },
          '.tooling': {
            display: 'none'
          }
        },
        inPorts: ['In'],
        outPorts: ['Out']
      },
      TASK: {
        size: {
          width: 80,
          height: 80
        },
        attrs: {
          rect: { fill: 'brown' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' },
          '.tooling': {
            display: 'none'
          }
        },
        outPorts: ['']
      },
      TASK_TWO_WAY: {
        size: {
          width: 80,
          height: 80
        },
        attrs: {
          rect: { fill: 'brown' },
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' },
        },
        inPorts: ['In'],
        outPorts: ['Out']
      },
      PIPE_SOURCE: {
        size: {
          width: 60,
          height: 60
        },
        attrs: {
          rect: { fill: 'green' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output', r: 8 },
          '.label': { text: 'Source', fill: 'white' }
        },
        outPorts: ['']
      },
      PARALLEL: {
        size: {
          width: 100,
          height: 100
        },
        attrs: {
          'circle': { fill: 'purple'},
          'text': { text: 'Parallel', fill: 'white' }
        }
      },
      SEQUENCE: {
        size: {
          width: 120,
          height: 60
        },
        attrs: {
          rect: { fill: 'blue' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output', r: 8 },
          '.label': { text: 'Series', fill: 'white' }
        },
        outPorts: ['']
      }
    }
  }
};
