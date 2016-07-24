import React, { Component } from 'react';
import {findDOMNode } from 'react-dom';
import joint from 'jointjs';

import './_style.scss';

export default class Graph extends Component {

    constructor(props) {
        super(props);
        this.graph = new joint.dia.Graph();
    }

    componentDidMount() {
        this.paper = new joint.dia.Paper({
            el: findDOMNode(this.refs.placeholder),
            width: 600,
            height: 200,
            model: this.graph,
            gridSize: 1
        });

        const rect = new joint.shapes.basic.Rect({
            position: { x: 100, y: 30 },
            size: { width: 100, height: 30 },
            attrs: {
                rect: { fill: 'blue' },
                text: { text: 'my box', fill: 'white' }
            }
        });

        const rect2 = rect.clone();
        rect2.translate(300);

        const link = new joint.dia.Link({
            source: { id: rect.id },
            target: { id: rect2.id }
        });

        this.graph.addCells([rect, rect2, link]);
    }

    render() {
        return <div ref="placeholder" ></div>;
    }
}
