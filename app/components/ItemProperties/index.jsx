import React, { Component } from 'react';
import { GRID_CONST } from '../../constants';
import TextField from '../MutableTextField';

class ItemPropertiesComponent extends Component {

  updateX(event, next) {
    let delta = (event.target.value - Math.floor(this.props.item.attributes.position.x / GRID_CONST.SNAP_SIZE)) * GRID_CONST.SNAP_SIZE;
    this.props.item.getAncestors()[0].translate(delta);
    next(event);
  }

  updateY(event, next) {
    let delta = (event.target.value - Math.floor(this.props.item.attributes.position.y / GRID_CONST.SNAP_SIZE)) * GRID_CONST.SNAP_SIZE;
    this.props.item.getAncestors()[0].translate(0, -delta);
    event.target.value = Math.floor(this.props.item.attributes.position.y / GRID_CONST.SNAP_SIZE);
    next(event);
  }

  render() {
    const item = this.props.item;
    const itemXLoc = Math.floor(item.attributes.position.x / GRID_CONST.SNAP_SIZE);
    const itemYLoc = Math.floor(item.attributes.position.y / GRID_CONST.SNAP_SIZE);
    return (
      <div>
        <h3>x: <TextField ref={'field-location-x'} hintText="Hint Text" value={itemXLoc} type={'number'} onChange={this.updateX.bind(this)} /></h3>
        <h3>y: <TextField ref={'field-location-x'} hintText="Hint Text" value={itemYLoc} type={'number'} onChange={this.updateY.bind(this)} /></h3>
      </div>
    );
  }

}

export default ItemPropertiesComponent;
