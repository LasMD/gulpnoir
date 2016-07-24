import React, { Component } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import FlatButton from 'material-ui/FlatButton';

import NavButton from '../../components/NavButton';
import PluginsList from '../../components/PluginsList';
import TasksList from '../../components/TasksList';
import FlowGraph from '../../components/FlowGraph';
import FlexColumn from '../../components/FlexColumn';
import FlexRow from '../../components/FlexRow';
import Divider from 'material-ui/Divider';

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
        <FlexRow>
          <FlexColumn size={'40%'}>
            <PluginsList
            onPluginSelect={(plugin) => { console.log(plugin) }}
            />
            <Divider />
            <TasksList />
          </FlexColumn>
          <FlowGraph />
        </FlexRow>
      </main>
    );
  }
}
