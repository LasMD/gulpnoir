import React, { Component } from 'react';
import {findDOMNode } from 'react-dom';
import joint from 'jointjs';

import './_style.scss';

export default class FlowGraph extends Component {

  constructor(props) {
    super(props);
    this.graph = new joint.dia.Graph();
    this.state = {
      graphCells: new Map(),
      graphCellsAttrs: new Map(),
      selectedCell: null,
      boundCellID: null
    }
  }

  createTask({x, y, text}) {
    const props = {
      position: { x: x, y: y },
      size: { width: 60, height: 60 },
      attrs: {
        rect: { fill: 'orange' },
        text: { text: text, fill: 'white' }
      }
    };
    let cell = new joint.shapes.basic.Rect(props);
    this.state.graphCells.set(cell.id, cell);
    this.state.graphCellsAttrs.set(cell.id, props.attrs);
    return cell;
  }

  createParallel({x, y, text}) {
    const props = {
      position: { x: x, y: y },
      size: { width: 150, height: 150 },
      attrs: {
        circle: { fill: 'blue' },
        text: { text: text, fill: 'white' }
      }
    };
    let cell = new joint.shapes.basic.Circle(props);
    this.state.graphCells.set(cell.id, cell);
    this.state.graphCellsAttrs.set(cell.id, props.attrs);
    return cell;
  }

  removeBoundCell() {
    let boundCell = this.graph.getCell(this.state.boundCellID);
    let embeds = boundCell.get('embeds');
    for (let index in embeds) {
      boundCell.unembed(this.graph.getCell(embeds[index]));
    }
    boundCell.remove();
    this.state.boundCellID = null;
  }

  createSelectedBound(cell) {

    if (this.state.boundCellID) {
      this.removeBoundCell(this.graph);
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
    this.state.boundCellID = boundCell.id;
    this.graph.addCell(boundCell);
    boundCell.embed(cell.model);
    return boundCell;
  }

  setSelectedCell(cell) {
    if (this.state.selectedCell && (cell.model.id == this.state.selectedCell || this.state.boundCellID == cell.model.id)) return;
    else {
      this.state.selectedCell = cell.model.id;
      this.createSelectedBound(cell);
    }
  }

  componentDidMount() {
      this.paper = new joint.dia.Paper({
          el: findDOMNode(this.refs.placeholder),
          model: this.graph,
          gridSize: 15
      });

      const task = this.createTask({x: 100, y: 100, text: 'task'});

      const parallel = this.createParallel({x: 50, y: 50, text: 'parallel'});

      const link = new joint.dia.Link({
          source: { id: task.id },
          target: { id: parallel.id }
      });

      this.graph.addCells([task, parallel, link]);
      this.paper.on('cell:pointerclick', (cell, e, x, y) => {
        this.setSelectedCell(cell);
      });

      this.paper.on('blank:pointerclick', (e, x, y) => {
        if (this.state.boundCellID) {
          this.removeBoundCell();
        }
      });
  }

  render() {
      return <div ref="placeholder" ></div>;
  }
}
