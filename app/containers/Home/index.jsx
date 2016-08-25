import React, { Component } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import FlatButton from 'material-ui/FlatButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import NavButton from '../../components/NavButton';
import PluginsList from '../../components/PluginsList';
import TasksList from '../../components/TasksList';
import TasksDetail from '../../components/TasksDetail';
import TasksChannels from '../../stores/Tasks/TasksChannels';
import PropertiesGulpPlugin from '../../components/PropertiesGulpPlugin';
import PropertiesPipeSource from '../../components/PropertiesPipeSource';
import PropertiesTask from '../../components/PropertiesTask';
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
      selectedTask: TasksChannels.getSelectedTask()
    };
  }

  render() {

    let propertiesDisabled = true;
    let propertyItem = null;
    if (this.state.selectedItem && this.state.selectedItem.item) {
      propertiesDisabled = false;
      if (this.state.selectedItem.GulpPlugin) {
        propertyItem = (
          <PropertiesGulpPlugin GulpPlugin={this.state.selectedItem.GulpPlugin} item={this.state.selectedItem.item} task={this.state.selectedTask} />
        );
      } else if (this.state.selectedItem.PipeSource) {
        propertyItem = (
          <PropertiesPipeSource PipeSource={this.state.selectedItem.PipeSource} item={this.state.selectedItem.item} task={this.state.selectedTask} />
        );
      }
    }

    let taskItem;
    let showList = (<PluginsList
        onPluginSelect={(plugin) => { console.log(plugin) }}
        ref='plugin-list'
        height={ parseInt(localStorage.getItem('splitPanelh1'), 10) || 300 }
      />);
    if (this.state.selectedTask) {
      taskItem = (<PropertiesTask task={this.state.selectedTask}></PropertiesTask>);

      if (this.state.selectedTask.get('type') == "Functional") {
        showList = (<PluginsList
          onPluginSelect={(plugin) => { console.log(plugin) }}
          ref='plugin-list'
          height={ parseInt(localStorage.getItem('splitPanelh1'), 10) || 300 }
        />);
      } else {
        showList = (<TasksList
          onPluginSelect={(plugin) => { console.log(plugin) }}
          ref='tasks-list'
          height={ parseInt(localStorage.getItem('splitPanelh1'), 10) || 300 }
        />);
      }
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
                {showList}
                <Tabs>
                  <Tab label='Project Details'>
                    <TasksDetail />
                    {taskItem}
                    {propertyItem}
                  </Tab>
                </Tabs>
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
