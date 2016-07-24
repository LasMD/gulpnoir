import React, { Component } from 'react';
import './_style.scss';
import {Tabs, Tab} from 'material-ui/Tabs';


export default class TasksList extends Component {

  render() {
    return (
      <div className={'tasks-list'}>
        <Tabs>
          <Tab label="Tasks">
            Tasks are listed here
          </Tab>
        </Tabs>
      </div>
    );
  }
}
