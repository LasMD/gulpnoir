import React, { Component } from 'react';
import {findDOMNode } from 'react-dom';
import joint from 'jointjs';

import './_style.scss';

export default class Graph extends Component {

    constructor(props) {
        super(props);
        this.graph = new joint.dia.Graph();
    }

    addTask({props, shape}) {
      return new joint.shapes.basic[shape](props);
    }

    componentDidMount() {
        this.paper = new joint.dia.Paper({
            el: findDOMNode(this.refs.placeholder),
            width: 600,
            height: '100vh',
            model: this.graph,
            gridSize: 4
        });

        const task1 = this.addTask({
          shape: 'Rect',
          props: {
              position: { x: 100, y: 30 },
              size: { width: 100, height: 30 },
              attrs: {
                  rect: { fill: 'green' },
                  text: { text: 'Some Task', fill: 'white' }
              }
          }
        });

        const task2 = this.addTask({
          shape: 'Rect',
          props: {
              position: { x: 100, y: 30 },
              size: { width: 100, height: 30 },
              attrs: {
                  rect: { fill: 'green' },
                  text: { text: 'Other Task', fill: 'white' }
              }
          }
        });

        const parallel = this.addTask({
          shape: 'Circle',
          props: {
              position: { x: 100, y: 30 },
              size: { width: 120, height: 120 },
              attrs: {
                  circle: { fill: 'blue' },
                  text: { text: 'Some Parallel', fill: 'white' }
              }
          }
        });

        parallel.translate(100);
        task2.translate(200);

        const link1 = new joint.dia.Link({
            source: { id: task1.id },
            target: { id: parallel.id }
        });

        const link2 = new joint.dia.Link({
            source: { id: task2.id },
            target: { id: parallel.id }
        });

        this.graph.addCells([task1, task2, parallel, link1, link2]);
    }

    render() {
        return <div ref="placeholder" ></div>;
    }
}
