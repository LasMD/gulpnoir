import React, { Component } from 'react';
import { Tab, Tabs } from 'react-draggable-tab';
import FlowGraph from '../FlowGraph';
import { TasksDispatch } from '../../store/Tasks/TasksDispatcher';
import TasksStore from '../../store/Tasks/TasksStore';
import { Container } from 'flux/utils';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import {
  blueGrey600, blueGrey700, blueGrey800, blueGrey900
} from 'material-ui/styles/colors';

import './_style.scss';

class FlowGraphWindow extends Component {

  static getStores() {
    return [TasksStore];
  }

  static calculateState(prevState) {

    let toReturn = {
      tasks: TasksStore.getOpenTasks(),
    };

    let selectedTask = TasksStore.getSelectedTask();

    if (selectedTask) {
      toReturn.selectedTab = selectedTask.get('id').toString();
    } else {
      toReturn.selectedTab = '0';
    }
    return toReturn;
  }

  constructor(props) {
    super(props);

    this.state = {
      tasks: TasksStore.getOpenTasks(),
      selectedTab: TasksStore.getSelectedTask(),
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
    if (key == this.state.selectedTab) {
      TasksDispatch({
        type: 'tasks/items/select',
        item: null
      });
    }
    TasksDispatch({
      type: 'tasks/close',
      task: {
        id: key
      }
    });
  }

  handleTabPositionChange(e, key, currentTabs) {
    this.setState({tabs: currentTabs});
  }

  handleTabAddButtonClick(e, currentTabs) {
    this.setState({newTaskTypeDialogOpen: true});
  }

  handleClose(type) {
    if (type == "Functional" || type == "Parallel") {
      TasksDispatch({
        'type': 'tasks/new',
        'task': {
          'type': type
        }
      });
    }
    this.setState({newTaskTypeDialogOpen: false});
  }

  isDialogOpen() {
    return true;
  }

  render() {
    let tabs = [];
    for (let task of this.state.tasks) {
      let id = task.get('id').toString();
      let name = task.get('name').toString();
      tabs.push(
        <Tab
          key={id}
          title={name}
          containerStyle={{
            height: '100%',
          }}
        >
          <FlowGraph />
        </Tab>
      );
    }

    const newTaskTypeDialogActions = [
      <FlatButton
        label="Functional"
        onTouchTap={this.handleClose.bind(this, 'Functional')}
        />,
      <FlatButton
        label="Parallel"
        onTouchTap={this.handleClose.bind(this, 'Parallel')}
        />,
      <FlatButton
        label="Cancel"
        onTouchTap={this.handleClose.bind(this)}
      />,
    ];

    return (
      <div style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'darkslategrey'
        }}>
        <Dialog
          title="Create New Task"
          actions={newTaskTypeDialogActions}
          modal={true}
          open={this.state.newTaskTypeDialogOpen || false}
        >
          What type of Gulp task would you like to create?
          <p>
            <i>Tip: Functional contains Gulp plugins. Parallel contains other Gulp tasks.</i>
          </p>
        </Dialog>
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
    </div>
    );
  }
}

export default Container.create(FlowGraphWindow);
