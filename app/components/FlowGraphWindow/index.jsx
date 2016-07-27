import React, { Component } from 'react';
import { Tab, Tabs } from 'react-draggable-tab';
import FlowGraph from '../FlowGraph';
import { TasksDispatch } from '../../store/Tasks/TasksDispatcher';
import TasksStore from '../../store/Tasks/TasksStore';
import { Container } from 'flux/utils';

import {
  blueGrey600, blueGrey700, blueGrey800, blueGrey900
} from 'material-ui/styles/colors';

import './_style.scss';

class FlowGraphWindow extends Component {

  static getStores() {
    return [TasksStore];
  }

  static calculateState() {
    return {
      tasks: TasksStore.getTasks(),
      selectedTab: TasksStore.getSelectedTaskID().toString()
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      tasks: TasksStore.getTasks(),
      selectedTab: TasksStore.getSelectedTaskID(),
      badgeCount: 0
    };

    setTimeout(() => {
      TasksDispatch({
        'type': 'tasks/new'
      });
    }, 250);
  }

  componentDidMount() {
  }

  handleTabSelect(e, key, currentTabs) {
    TasksDispatch({
      type: 'tasks/setSelectedTaskID',
      task: {
        id: key
      }
    });
  }

  handleTabClose(e, key, currentTabs) {
    this.setState({tabs: currentTabs});
  }

  handleTabPositionChange(e, key, currentTabs) {
    this.setState({tabs: currentTabs});
  }

  handleTabAddButtonClick(e, currentTabs) {
    TasksDispatch({
      'type': 'tasks/new'
    });
  }

  render() {
    let tabs = [];
    for (let [id, task] of this.state.tasks) {
      tabs.push(
        <Tab
          key={id}
          title={task.name}
          containerStyle={{
            height: '100%',
          }}
        >
          <FlowGraph />
        </Tab>
      );
    }
    return (
      <Tabs
        selectedTab={this.state.selectedTab ? this.state.selectedTab : "tab2"}
        onTabSelect={this.handleTabSelect.bind(this)}
        onTabClose={this.handleTabClose.bind(this)}
        onTabAddButtonClick={this.handleTabAddButtonClick.bind(this)}
        onTabPositionChange={this.handleTabPositionChange.bind(this)}
        tabs={tabs}
        tabsStyles={{
          tabBar: {
            backgroundColor: 'darkslategray'
          },
          tab: {
            backgroundImage: `linear-gradient(${blueGrey800}, ${blueGrey900})`,
            cursor: 'pointer'
          },
          tabBefore: {
            backgroundImage: `linear-gradient(${blueGrey800}, ${blueGrey900})`,
            cursor: 'pointer'
          },
          tabAfter: {
            backgroundImage: `linear-gradient(${blueGrey800}, ${blueGrey900})`,
            cursor: 'pointer'
          },
          tabOnHover: {
            backgroundImage: `linear-gradient(${blueGrey700}, ${blueGrey800})`
          },
          tabBeforeOnHover: {
            backgroundImage: `linear-gradient(${blueGrey700}, ${blueGrey800})`
          },
          tabAfterOnHover: {
            backgroundImage: `linear-gradient(${blueGrey700}, ${blueGrey800})`
          },
          tabTitle: {
            cursor: 'pointer'
          },
          tabTitleActive: {
            cursor: 'default'
          },
          tabActive: {
            backgroundImage: `linear-gradient(${blueGrey600}, ${blueGrey700})`,
            cursor: 'default'
          },
          tabBeforeActive: {
            backgroundImage: `linear-gradient(${blueGrey600}, ${blueGrey700})`,
            cursor: 'default'
          },
          tabAfterActive: {
            backgroundImage: `linear-gradient(${blueGrey600}, ${blueGrey700})`,
            cursor: 'default'
          },
        }}
        shortCutKeys={
          {
            'close': ['alt+command+w', 'alt+ctrl+w'],
            'create': ['alt+command+t', 'alt+ctrl+t'],
            'moveRight': ['alt+command+tab', 'alt+ctrl+tab'],
            'moveLeft': ['shift+alt+command+tab', 'shift+alt+ctrl+tab']
          }
        }
      />
    );
  }
}

export default Container.create(FlowGraphWindow);
