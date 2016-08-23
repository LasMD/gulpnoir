import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import joint from 'jointjs';
import TasksChannels from '../../stores/Tasks/TasksChannels';
import { Container } from 'flux/utils';
import { DropTarget } from 'react-dnd';
import { GRID_CONST } from '../../constants';
import LinkChain from '../../LinkChain';

import './_style.scss';

const gridTarget = {
  drop(props, monitor, component) {
    const offset = monitor.getClientOffset();
    const componentRect = component.refs.placeholder.getClientRects()[0];
    const position = {
      x: offset.x - componentRect.left,
      y: offset.y - componentRect.top
    };
    return {
      grid: component,
      position
    };
  },

};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class FlowGraph extends Component {

  static getStores() {
    return [TasksChannels];
  }

  static calculateState() {
    return {
      selectedCell: TasksChannels.getSelectedItem()
    };
  }

  constructor(props) {
    super(props);
    this.graphState = {
      graphCells: new Map(),
      graphCellsAttrs: new Map(),
      connections: new LinkChain(),
      selectedCell: null,
      graphCellPluginIdMap: new Map(),
      boundCellID: null
    };
  }

  collisionLookup(cell, pos, opt) {
    var rect = joint.g.rect(cell.getBBox());
    var collisions = this.graph.findModelsInArea(rect);
    if (collisions.length > 1) {
      cell.translate(-opt.tx, -opt.ty);
    }
  }

  createPlugin({ x, y, text, id }) {
    const props = {
      position: { x: x, y: y },
      ...GRID_CONST.ITEM.PLUGIN
    };
    props.attrs['.label'] = { text };

    let cell = new joint.shapes.devs.Model(props);
    this.graphState.graphCells.set(cell.id, cell);
    this.graphState.graphCellsAttrs.set(cell.id, props.attrs);
    this.graphState.graphCellPluginIdMap.set(cell.id, id);
    this.graph.addCell(cell);
    cell.on('change:position', this.collisionLookup);
  }

  createParallel({x, y}) {
    const props = {
      position: { x: x, y: y },
      ...GRID_CONST.ITEM.PARALLEL
    };
    let cell = new joint.shapes.basic.Circle(props);
    this.graphState.graphCells.set(cell.id, cell);
    this.graphState.graphCellsAttrs.set(cell.id, props.attrs);
    this.graph.addCell(cell);
    cell.on('change:position', this.collisionLookup);
  }

  createPipeSource({x, y}) {
    const props = {
      position: { x: x, y: y },
      ...GRID_CONST.ITEM.PIPE_SOURCE
    };

    let cell = new joint.shapes.devs.Model(props);
    this.graphState.graphCells.set(cell.id, cell);
    this.graphState.graphCellsAttrs.set(cell.id, props.attrs);
    this.graph.addCell(cell);
    cell.on('change:position', this.collisionLookup);
  }

  createSequence({x, y}) {
    const props = {
      position: { x: x, y: y },
      ...GRID_CONST.ITEM.SEQUENCE
    };

    let cell = new joint.shapes.devs.Model(props);
    this.graphState.graphCells.set(cell.id, cell);
    this.graphState.graphCellsAttrs.set(cell.id, props.attrs);
    this.graph.addCell(cell);
    cell.on('change:position', this.collisionLookup);
  }

  deselectCell() {
    if (this.graphState.selectedCell) {
      let selectedCell = this.graph.getCell(this.graphState.selectedCell);
      this.graphState.selectedCell = null;
      selectedCell.attr({
        rect: {
          stroke: 'black',
          'stroke-width': '1',
          'stroke-dasharray': '0',
        }
      });
      TasksChannels.dispatch({
        channel: 'tasks/items/select',
        outgoing: {
          item: null
        }
      });
    }
  }


  setSelectedCell(cell) {
    if (this.graphState.selectedCell && (cell.model.id == this.graphState.selectedCell)) return;
    else {
      if (this.graphState.selectedCell) {
        let selectedCell = this.graph.getCell(this.graphState.selectedCell);
        this.graphState.selectedCell = null;
        selectedCell.attr({
          rect: {
            stroke: 'black',
            'stroke-width': '1',
            'stroke-dasharray': '0',
          }
        });
      }
      this.graphState.selectedCell = cell.model.id;
      cell.model.attr({
        rect: {
          stroke: 'lime',
          'stroke-width': '4',
          'stroke-dasharray': '5,5',
        }
      });
      TasksChannels.dispatch({
        channel: 'tasks/items/select',
        outgoing: {
          item: cell.model
        }
      });
      // this.createSelectedBound(cell);
    }
  }

  exportGraph(raw) {
    if (raw) return this.graph;
    return JSON.stringify(this.graph.toJSON());
  }

  exportConnections() {
    return this.graphState.connections;
  }

  componentDidMount() {

    this.graph = new joint.dia.Graph();
    this.paper = new joint.dia.Paper({
        el: findDOMNode(this.refs.placeholder),
        model: this.graph,
        gridSize: GRID_CONST.SNAP_SIZE,
        validateConnection: (cellViewS, magnetS, cellViewT, magnetT, end, linkView) => {

          // Disallow multiple connections from a single Out port
          let connectedLinks = this.graph.getConnectedLinks(cellViewS.model);
          if (connectedLinks.length > 0) {
            connectedLinks.forEach((link) => {
              if (!link.get('target').id && link.id != linkView.model.id) link.remove();
              else if (link.id != linkView.model.id) {
                if (link.get('target').port != 'In' && cellViewS.model.id == link.get('target').id) {
                  link.remove();
                  return false;
                }
                if (link.get('source').port != 'In' && cellViewS.model.id == link.get('source').id) {
                  link.remove();
                  return false;
                }
              }
            });
          }

          // Prevent linking from input ports.
          if (magnetS && magnetS.getAttribute('type') === 'input') return false;
          // Prevent linking from output ports to input ports within one element.
          if (cellViewS === cellViewT) return false;

          // Disallow multiple connections to a single In port
          connectedLinks = this.graph.getConnectedLinks(cellViewT.model);
          let hasLink = false;
          if (connectedLinks.length > 0) {
            connectedLinks.forEach((link) => {
              if (!link.get('target').id) link.remove();
              else {
                if (link.get('target').port == 'In' && cellViewT.model.id == link.get('target').id) hasLink = true;
                if (link.get('source').port == 'In' && cellViewT.model.id == link.get('source').id) hasLink = true;
              }
            });
          }
          if (hasLink) return false;

          // Prevent linking to input ports.
          return magnetT && magnetT.getAttribute('type') === 'input';
        },
    });

    this.paper.options.restrictTranslate = function(cellView) {
      // move element inside the bounding box of the paper element only
      let boundArea = cellView.paper.getArea();
      boundArea.width = (Math.floor(cellView.paper.el.clientWidth / GRID_CONST.SNAP_SIZE) -1) * GRID_CONST.SNAP_SIZE;
      boundArea.height = (Math.floor(cellView.paper.el.clientHeight / GRID_CONST.SNAP_SIZE) -1) * GRID_CONST.SNAP_SIZE;
      return boundArea;
    }

    if (this.props.task.get('graph')) {
      this.graph = this.graph.fromJSON(JSON.parse(this.props.task.get('graph')));
    } else {
      switch (this.props.task.get('type')) {
        case 'Functional': {
          this.createPipeSource({x: 100, y: 100});
          break;
        }
        case 'Sequence': {
          this.createSequence({x: 100, y: 100});
          break;
        }
        case 'Parallel': {
          this.createParallel({x: 100, y: 100});
          break;
        }
      }
    }

    TasksChannels.dispatch({
      channel: 'tasks/update',
      outgoing: {
        task: {
          id: this.props.task.get('id'),
          exportGraph: this.exportGraph.bind(this),
          exportConnections: this.exportConnections.bind(this)
        }
      }
    });

    this.paper.on('cell:pointerclick', (cell, e, x, y) => {
      if (cell.model.attributes.type != 'link') {
        this.setSelectedCell(cell);
      }
    });

    this.paper.on('cell:pointerup', (cell, e, x, y) => {
      if (cell.model.attributes.type == 'link' && (!cell.model.attributes.target.id || !cell.model.attributes.source.id)) {
        cell.remove();
        return;
      } else if (cell.model.attributes.type == 'link') {
        let target = this.graph.getCell(cell.model.attributes.target.id);
        console.log(this.graphState.connections);
        if (cell.model.attributes.source.id == this.graphState.connections.last.data.cellId || this.graphState.connections.length == 1) {

          let newLink = new LinkChain({
              data: {
                cellId: cell.model.attributes.target.id,
                itemId: this.graphState.graphCellPluginIdMap.get(cell.model.attributes.target.id)
              }
          });

          this.graphState.connections.append(newLink);

          for (let link of this.graphState.connections) {
            console.log("link", link);
          }
        }
      }
    });

    this.paper.on('blank:pointerclick', (e, x, y) => {
      if (this.graphState.selectedCell) {
        this.deselectCell();
      }
    });
  }

  render() {
    const { x, y, connectDropTarget, isOver } = this.props;
    return connectDropTarget(
      <div className={'paper'}>
        <div ref="placeholder" ></div>
      </div>
    );
  }
}

export default DropTarget("GraphItems", gridTarget, collect)(Container.create(FlowGraph));
