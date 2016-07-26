import React, { Component } from 'react';
import { RadioButtonGroup } from 'material-ui/RadioButton';
import { Container } from 'flux/utils';

const ENTER_KEY_CODE = 13;

export default class MutableRadioButtonGroup extends Component {

  state = {
    selected: this.props.selected,
    prevState: null,
  }

  render() {

    // If the Value prop is dynamically changed by the parent, be sure to sync
    if (this.state.prevState == this.state && this.state.selected != this.props.selected) {
      this.state['selected'] = this.props.selected || '';
    }
    this.state.prevState = this.state;

    return (
      <RadioButtonGroup
        name={this.props.name}
        className={this.props.className}
        valueSelected={this.state.selected}
        onChange={this._onChange}
      >
        {this.props.children}
      </RadioButtonGroup>
    );
  }

  _save = () => {
    this.props.onSave(this.state.valueSelected);
    // this.setState({value: ''});
  }

  _onChange = (event: any) => {
    this.setState({selected: event.target.value});
  }
}
