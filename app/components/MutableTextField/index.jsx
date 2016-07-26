import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { Container } from 'flux/utils';

const ENTER_KEY_CODE = 13;

export default class TodoTextInput extends Component {

  state = {
    value: this.props.value || '',
    prevState: null
  }

  render() {

    // If the Value prop is dynamically changed by the parent, be sure to sync
    if (this.state.prevState == this.state && this.state.value != this.props.value) {
      this.state = {
        value: this.props.value || ''
      }
    }
    this.state.prevState = this.state;

    return (
      <TextField
        name={this.props.name}
        className={this.props.className}
        placeholder={this.props.placeholder}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
        value={this.state.value}
        autoFocus={true}
      />
    );
  }

  _save = () => {
    this.props.onSave(this.state.value);
    // this.setState({value: ''});
  }

  _onChange = (event: any) => {
    this.setState({value: event.target.value});
  }

  _onKeyDown = (event: any) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      this._save();
    }
  }
}
