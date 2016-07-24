import React, { Component } from 'react';
import { Tab, Tabs } from 'react-draggable-tab';
import FlowGraph from '../FlowGraph';

import {
  blueGrey600, blueGrey700, blueGrey800, blueGrey900
} from 'material-ui/styles/colors';

import './_style.scss';

export default class FlowGraphWindow extends Component {

  constructor(props) {
      super(props);

      this.state = {
      tabs:[
        (<Tab
          key={'tab0'}
          title={'New Task'}
          containerStyle={{
            height: '100%',
          }}
        >
          <FlowGraph />
        </Tab>),
      ],
      badgeCount: 0
    };
  }

  componentDidMount() {
    this.setState({selectedTab: 'tab0'});
  }

  handleTabSelect(e, key, currentTabs) {
    console.log('handleTabSelect key:', key);
    this.setState({selectedTab: key, tabs: currentTabs});
  }

  handleTabClose(e, key, currentTabs) {
    console.log('tabClosed key:', key);
    this.setState({tabs: currentTabs});
  }

  handleTabPositionChange(e, key, currentTabs) {
    console.log('tabPositionChanged key:', key);
    this.setState({tabs: currentTabs});
  }

  handleTabAddButtonClick(e, currentTabs) {
    // key must be unique
    const key = 'newTab_' + Date.now();
    let newTab = (
      <Tab
        key={key}
        title={'New Task'}
        containerStyle={{
          height: '100%'
        }}
      >
        <FlowGraph />
      </Tab>
    );
    let newTabs = currentTabs.concat([newTab]);

    this.setState({
      tabs: newTabs,
      selectedTab: key
    });
  }

  render() {
      return (
        <Tabs
          selectedTab={this.state.selectedTab ? this.state.selectedTab : "tab2"}
          onTabSelect={this.handleTabSelect.bind(this)}
          onTabClose={this.handleTabClose.bind(this)}
          onTabAddButtonClick={this.handleTabAddButtonClick.bind(this)}
          onTabPositionChange={this.handleTabPositionChange.bind(this)}
          tabs={this.state.tabs}
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
