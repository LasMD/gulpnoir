import React, { Component } from 'react';
import { GRID_CONST } from '../../constants';
import TextField from '../MutableTextField';
import FlatButton from 'material-ui/FlatButton';
import TasksChannels from '../../stores/Tasks/TasksChannels';
import Paper from 'material-ui/Paper';
import PipeSource from '../../stores/Tasks/PipeSource';

class PropertiesPipeSource extends Component {

  componentWillMount() {
    this.globValue = this.props.PipeSource.get('glob');
    this.destValue = this.props.PipeSource.get('dest');
  }

  updateProps() {
    this.globValue = this.refs.globInput.getValue();
    this.destValue = this.refs.destInput.getValue();
    TasksChannels.dispatch({
      channel: 'tasks/items/new',
      outgoing: {
        task: {
          id: this.props.task.get('id'),
        },
        itemId: "PipeSource",
        item: new PipeSource({
          glob: this.refs.globInput.getValue(),
          dest: this.refs.destInput.getValue()
        })
      }
    });
    this.forceUpdate();
  }

  render() {
    let renderItem = (<div></div>);

    if (this.props.PipeSource) {
      renderItem = (
        <Paper className={`propertyPaper`}  zDepth={1}>
          <h2>Source Properties</h2>
          <div><b>Glob:</b> <TextField ref={'globInput'} value={this.globValue} placeholder={`./my/html/files/**/*.html`} /></div>
          <div><b>Dest:</b> <TextField ref={'destInput'} value={this.destValue} placeholder={`./my/html/files/out/`} /></div>
          <FlatButton onClick={this.updateProps.bind(this)} label={`Update`} />
        </Paper>
      )
    }

    return renderItem;
  }

}

export default PropertiesPipeSource;
