import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import joint from 'jointjs';
import TasksChannels from '../../stores/Tasks/TasksChannels';
import { Container } from 'flux/utils';
import { DropTarget } from 'react-dnd';
import { GRID_CONST } from '../../constants';

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
      selectedCell: null,
      boundCellID: null
    };
  }

  createPlugin({ x, y, text }) {
    const props = {
      position: { x: x, y: y },
      ...GRID_CONST.ITEM.PLUGIN
    };
    props.attrs['.label'] = { text };

    let cell = new joint.shapes.devs.Model(props);
    this.graphState.graphCells.set(cell.id, cell);
    this.graphState.graphCellsAttrs.set(cell.id, props.attrs);
    this.graph.addCell(cell);
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
  }

  removeBoundCell() {
    let boundCell = this.graph.getCell(this.graphState.boundCellID);
    let embeds = boundCell.get('embeds');
    for (let index in embeds) {
      boundCell.unembed(this.graph.getCell(embeds[index]));
    }
    boundCell.remove();
    this.graphState.boundCellID = null;
    this.graphState.selectedCell = null;
    TasksChannels.dispatch({
      channel: 'tasks/items/select',
      outgoing: {
        item: null
      }
    });
  }

  createSelectedBound(cell) {

    if (this.graphState.boundCellID) {
      this.removeBoundCell();
    }

    const width = cell.model.attributes.size.width;
    const height = cell.model.attributes.size.height;
    const x = cell.model.attributes.position.x;
    const y = cell.model.attributes.position.y;
    const props = {
      position: { x: x, y: y },
      size: { width: width, height: height },
      attrs: {}
    };

    let shape = "";
    if (cell.model.attributes.attrs.hasOwnProperty('rect')) {
      shape = 'Rect';
    } else {
      shape = 'Circle';
    }

    const shapeLower = shape.toLowerCase();
    let boundCell = new joint.shapes.basic[shape](props);
    boundCell.attr(shapeLower + '/stroke', 'lime');
    boundCell.attr(shapeLower + '/fill-opacity', '0');
    boundCell.attr(shapeLower + '/stroke-width', '4');
    boundCell.attr(shapeLower + '/stroke-dasharray', '5,5');
    this.graphState.boundCellID = boundCell.id;
    this.graph.addCell(boundCell);
    boundCell.embed(cell.model);
    TasksChannels.dispatch({
      channel: 'tasks/items/select',
      outgoing: {
        item: cell.model
      }
    });
    return boundCell;
  }

  setSelectedCell(cell) {
    if (this.graphState.selectedCell && (cell.model.id == this.graphState.selectedCell || this.graphState.boundCellID == cell.model.id)) return;
    else {
      this.graphState.selectedCell = cell.model.id;
      this.createSelectedBound(cell);
    }
  }

  exportGraph() {
    return JSON.stringify(this.graph.toJSON());
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
          exportGraph: this.exportGraph.bind(this)
        }
      }
    });

    this.paper.on('cell:pointerclick', (cell, e, x, y) => {
      this.setSelectedCell(cell);
    });

    this.paper.on('cell:pointerup', (cell, e, x, y) => {
      if (cell.model.attributes.type == 'link' && (!cell.model.attributes.target.id || !cell.model.attributes.source.id)) {
        cell.remove();
        return;
      }
    });

    this.paper.on('blank:pointerclick', (e, x, y) => {
      if (this.graphState.boundCellID) {
        this.removeBoundCell();
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
