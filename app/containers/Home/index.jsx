import React, { Component } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import FlatButton from 'material-ui/FlatButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import NavButton from '../../components/NavButton';
import PluginsList from '../../components/PluginsList';
import TasksProperties from '../../components/TasksProperties';
import TasksChannels from '../../stores/Tasks/TasksChannels';
import ItemProperties from '../../components/ItemProperties';
import FlowGraph from '../../components/FlowGraph';
import FlowGraphWindow from '../../components/FlowGraphWindow';
import FlexColumn from '../../components/FlexColumn';
import FlexRow from '../../components/FlexRow';
import Divider from 'material-ui/Divider';
import { Container } from 'flux/utils';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import ipcEvents from '../../ipcEvents';

import SplitPane from 'react-split-pane';

import vstyles from './_style.scss';

class HomePage extends Component {

  static getStores() {
    return [TasksChannels];
  }

  static calculateState(prevState) {
    return {
      selectedItem: TasksChannels.getSelectedItem(),
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
          <SplitPane split="vertical" minSize={50}
            defaultSize={ parseInt(localStorage.getItem('splitPanelv1'), 10) || 300 }
            onChange={ size => localStorage.setItem('splitPanelv1', size) }>
            <FlexColumn>
              <SplitPane split="horizontal" minSize={50} defaultSize={ parseInt(localStorage.getItem('splitPanelh1'), 10) || 300 }
                onChange={ size => {
                  localStorage.setItem('splitPanelh1', size);
                  this.refs['plugin-list'].updateHeight(size);
                }}>
                <PluginsList
                onPluginSelect={(plugin) => { console.log(plugin) }}
                ref='plugin-list'
                height={ parseInt(localStorage.getItem('splitPanelh1'), 10) || 300 }
                />
                {
                  propertiesDisabled ? (
                    <TasksProperties />
                  ) : (
                    <SplitPane split="horizontal" minSize={50}
                      defaultSize={ parseInt(localStorage.getItem('splitPanelh2'), 10) || 300 }
                      onChange={ size => localStorage.setItem('splitPanelh2', size) }>
                      <TasksProperties />
                      <Tabs>
                        <Tab label="Item Properties">
                          <ItemProperties item={this.state.selectedItem} />
                        </Tab>
                      </Tabs>
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
