import React, { Component } from 'react';
import {findDOMNode } from 'react-dom';
import joint from 'jointjs';

import './_style.scss';

export default class FlowGraph extends Component {

  constructor(props) {
    super(props);
    this.graph = new joint.dia.Graph();
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
    return new joint.shapes.basic.Rect(props);
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
    return new joint.shapes.basic.Circle(props);
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
  }

  render() {
      return <div ref="placeholder" ></div>;
  }
}
