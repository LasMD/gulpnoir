import React, { Component } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import FlatButton from 'material-ui/FlatButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import NavButton from '../../components/NavButton';
import PluginsList from '../../components/PluginsList';
import TasksProperties from '../../components/TasksProperties';
import FlowGraph from '../../components/FlowGraph';
import FlowGraphWindow from '../../components/FlowGraphWindow';
import FlexColumn from '../../components/FlexColumn';
import FlexRow from '../../components/FlexRow';
import Divider from 'material-ui/Divider';
import TasksStore from '../../store/Tasks/TasksStore';
import { TasksDispatch } from '../../store/Tasks/TasksDispatcher';
import { Container } from 'flux/utils';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import SplitPane from 'react-split-pane';

import vstyles from './_style.scss';

class HomePage extends Component {

  static getStores() {
    return [TasksStore];
  }

  static calculateState(prevState) {
    return {
      selectedItem: TasksStore.getSelectedItem(),
    };
  }

  render() {

    let propertiesDisabled = true;

    if (this.state.selectedItem) {
      propertiesDisabled = false;
    }

    return (
      <main className={'page-home'}>
        <FlexRow>
          <SplitPane split="vertical" minSize={50} defaultSize={300}>
            <FlexColumn>
              <SplitPane split="horizontal" minSize={50} defaultSize={300}
                onChange={ size => this.refs['plugin-list'].updateHeight(size) }
                >
                <PluginsList
                onPluginSelect={(plugin) => { console.log(plugin) }}
                ref='plugin-list'
                />
                {
                  propertiesDisabled ? (
                    <TasksProperties />
                  ) : (
                    <SplitPane split="horizontal" minSize={50} defaultSize={300}>
                      <TasksProperties />
                      <Tabs><Tab label="Item Properties"></Tab></Tabs>
                    </SplitPane>)
                }
              </SplitPane>
            </FlexColumn>
            <FlowGraphWindow />
          </SplitPane>
        </FlexRow>
      </main>
    );
  }
}

export default DragDropContext(HTML5Backend)(Container.create(HomePage));
