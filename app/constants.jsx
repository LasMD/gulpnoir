export default {
  GRID_CONST: {
    SNAP_SIZE: 15,
    ITEM: {
      PLUGIN: {
        size: {
          width: 120,
          height: 120
        },
        attrs: {
          rect: { fill: 'orange' },
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' },
        },
        inPorts: ['In'],
        outPorts: ['Out']
      },
      PARALLEL: {

      },
      SEQUENCE: {

      },
      PIPE_SOURCE: {

      }
    }
  }
};
