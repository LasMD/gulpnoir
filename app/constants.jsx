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
          '.label': { text: 'Source', color: 'white' }
        },
        outPorts: ['']
      },
      PARALLEL: {

      },
      SEQUENCE: {

      }
    }
  }
};
