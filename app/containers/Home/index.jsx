import React, { Component } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import FlatButton from 'material-ui/FlatButton';

import NavButton from '../../components/NavButton';
import PluginsList from '../../components/PluginsList';
import FlowGraph from '../../components/FlowGraph';

import vstyles from './_style.scss';

export default class HomePage extends Component {

  componentDidMount() {
    this.setState({gulpTasks: []});
  }

  getGulpTasks() {
    if (this.state && this.state.gulpTasks && this.state.gulpTasks.length > 0) {
      return (this.state.gulpTasks.map(
        (result) => <option>{result.name[0]}</option>
      ));
    } else {
      return <option>{'None'}</option>;
    }
  }

  getAddedPlugins() {
    if (this.state && this.state.addedPlugins && this.state.addedPlugins.length > 0) {
      return (this.state.addedPlugins.map(
        (result) => <option>{result.name[0]}</option>
      ));
    } else {
      return <option>{'None'}</option>;
    }
  }

  render() {
    return (
      <main className={'page-home'}>
          <div style={{ display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around' }}>
            <h2>Tasks</h2>
            <select ref={ (ref) => this.gulpTasks = ref }>
              {this.getGulpTasks()}
            </select>
            <FlatButton>Create Task</FlatButton>
          </div>
          <div style={{ display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around' }}>
            <h2>Added Plugins</h2>
            <select multiple>
              {this.getAddedPlugins()}
            </select>
          </div>
        <br />
        <NavButton to={''}>Back</NavButton>
        <PluginsList
        onPluginSelect={(plugin) => {console.log(plugin)}}
         />
         <FlowGraph />
      </main>
    );
  }
}
