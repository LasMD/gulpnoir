import React, { Component } from 'react';
import { Tab, Tabs } from 'react-draggable-tab';
import FlowGraph from '../FlowGraph';
import TasksChannels from '../../stores/Tasks/TasksChannels';
import { Container } from 'flux/utils';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import {
  blueGrey100, blueGrey200, blueGrey300, blueGrey400, blueGrey500, blueGrey600, blueGrey700, blueGrey800, blueGrey900
} from 'material-ui/styles/colors';

class FlowGraphWindow extends Component {

  static getStores() {
    return [TasksChannels];
  }

  static calculateState(prevState) {

    let toReturn = {
      openTasks: TasksChannels.getOpenTasks(),
      tasks: TasksChannels.getTasks()
    };

    let selectedTask = TasksChannels.getSelectedTask();

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
      openTasks: TasksChannels.getOpenTasks(),
      tasks: TasksChannels.getTasks(),
      selectedTab: TasksChannels.getSelectedTask(),
    };

    TasksChannels.dispatch({
      channel: 'tasks/new'
    });
  }

  componentDidMount() {
  }

  handleTabSelect(e, key, currentTabs) {

    TasksChannels.dispatch({
      channel: 'tasks/setSelectedTaskID',
      outgoing: {
        task: {
          id: (key*1) // Cast key from string to integer
        }
      }
    });
  }

  handleTabClose(e, key, currentTabs) {
    if (key == this.state.selectedTab) {
      TasksChannels.dispatch(() => ({
        channel: 'tasks/items/select',
        outgoing: {
          item: null
        }
      }));
    }

    TasksChannels.dispatch({
      channel: 'tasks/close',
      outgoing: {
        task: {
          id: key
        }
      }
    });

  }

  handleTabPositionChange(e, key, currentTabs) {
    TasksChannels.dispatch({
      channel: 'tasks/arrange',
      outgoing: currentTabs
    });
  }

  handleTabAddButtonClick(e, currentTabs) {
    this.setState({newTaskTypeDialogOpen: true});
  }

  handleNewTaskTypeClose(type) {
    if (type == "Functional" || type == "Parallel" || type == "Series") {
      TasksChannels.dispatch({
        channel: 'tasks/new',
        outgoing: {
          task: {
            type: type
          }
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
    for (let openTask of this.state.openTasks) {
      let task = this.state.tasks.get(openTask);
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
          <FlowGraph
            task={task}
          />
        </Tab>
      );
    }



    const newTaskTypeDialogActions = [
      <FlatButton
        label="Functional"
        onTouchTap={this.handleNewTaskTypeClose.bind(this, 'Functional')}
        />,
      <FlatButton
        label="Parallel"
        onTouchTap={this.handleNewTaskTypeClose.bind(this, 'Parallel')}
        />,
      <FlatButton
        label="Series"
        onTouchTap={this.handleNewTaskTypeClose.bind(this, 'Series')}
        />,
      <FlatButton
        label="Cancel"
        onTouchTap={this.handleNewTaskTypeClose.bind(this)}
      />,
    ];

    return (
      <div className={`window-wrapper`}
        style={{
        backgroundColor: `${blueGrey700}`
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
        { this.state.selectedTab != 0 ? <Tabs
          selectedTab={this.state.selectedTab ? this.state.selectedTab : "none"}
          onTabSelect={this.handleTabSelect.bind(this)}
          onTabClose={this.handleTabClose.bind(this)}
          onTabAddButtonClick={this.handleTabAddButtonClick.bind(this)}
          onTabPositionChange={this.handleTabPositionChange.bind(this)}
          tabs={tabs}
          tabsStyles={{
            tabBar: {
              backgroundColor: `${blueGrey300}`
            },
            tabBarAfter: {
              backgroundColor: `${blueGrey500}`
            },
            tab: {
              backgroundImage: `linear-gradient(${blueGrey600}, ${blueGrey700})`,
              cursor: 'pointer',
              boxShadow: `${blueGrey700} -1px 1px 0px inset, rgba(0, 0, 0, 0.0980392) 4px 0px 4px`
            },
            tabBefore: {
              backgroundImage: `linear-gradient(${blueGrey600}, ${blueGrey700})`,
              cursor: 'pointer',
              boxShadow: `${blueGrey700} 1px 1px 0px inset, rgba(0, 0, 0, 0.0980392) -4px 0px 4px`
            },
            tabAfter: {
              backgroundImage: `linear-gradient(${blueGrey600}, ${blueGrey700})`,
              cursor: 'pointer',
              boxShadow: `${blueGrey700} -1px 1px 0px inset, rgba(0, 0, 0, 0.0980392) 4px 0px 4px`
            },
            tabOnHover: {
              backgroundImage: `linear-gradient(${blueGrey500}, ${blueGrey600})`
            },
            tabBeforeOnHover: {
              backgroundImage: `linear-gradient(${blueGrey500}, ${blueGrey600})`
            },
            tabAfterOnHover: {
              backgroundImage: `linear-gradient(${blueGrey500}, ${blueGrey600})`
            },
            tabTitle: {
              cursor: 'pointer'
            },
            tabTitleActive: {
              cursor: 'default'
            },
            tabActive: {
              backgroundImage: `linear-gradient(${blueGrey400}, ${blueGrey500})`,
              cursor: 'default',
              boxShadow: `${blueGrey600} -1px 1px 0px inset, rgba(0, 0, 0, 0.0980392) 4px 0px 4px`
            },
            tabBeforeActive: {
              backgroundImage: `linear-gradient(${blueGrey400}, ${blueGrey500})`,
              cursor: 'default',
              boxShadow: `${blueGrey600} 1px 1px 0px inset, rgba(0, 0, 0, 0.0980392) -4px 0px 4px`
            },
            tabAfterActive: {
              backgroundImage: `linear-gradient(${blueGrey400}, ${blueGrey500})`,
              cursor: 'default',
              boxShadow: `${blueGrey600} -1px 1px 0px inset, rgba(0, 0, 0, 0.0980392) 4px 0px 4px`
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
      :
      <div className={'welcome-wrapper'}>
        <h1 style={{
            color: `${blueGrey900}`
          }}>Welcome to GulpNoir</h1>
        <FlatButton
          label={'Create a new Task'}
          onClick={this.handleTabAddButtonClick.bind(this)}
          />
      </div>
    }
    </div>
    );
  }
}

export default Container.create(FlowGraphWindow);
