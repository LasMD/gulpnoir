import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { Container } from 'flux/utils';

const ENTER_KEY_CODE = 13;

export default class MutableTextField extends Component {

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
        type={this.props.type}
        className={this.props.className}
        placeholder={this.props.placeholder}
        onChange={this.props.onChange ? this._userOnChange : this._onChange}
        onKeyDown={this.props.onKeyDown || this._onKeyDown}
        value={this.state.value}
        autoFocus={true}
        style={this.props.style}
        errorText={this.props.errorText}
      />
    );
  }

  getValue() {
    return this.state.value;
  }

  _userOnChange = (event) => {
    this._onChange(event);
    this.props.onChange(event);
  }

  _onChange = (event: any) => {
    this.setState({value: event.target.value});
  }

}
