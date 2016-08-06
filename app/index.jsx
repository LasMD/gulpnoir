import React from 'react';
import { render } from 'react-dom';
import Home from './containers/Home';

import './styles.scss';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  blueGrey500, blueGrey700,
  pinkA200,
  grey100, grey300, grey400, grey500,
  blueGrey50, darkBlack, fullBlack,
  teal500, teal100, teal800
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
  primary1Color:  blueGrey500,
  primary2Color:  blueGrey700,
  primary3Color: grey400,
  accent1Color: teal500,
  accent2Color: teal100,
  accent3Color: teal800,
  textColor: darkBlack,
  alternateTextColor: blueGrey50,
  canvasColor: blueGrey50,
  borderColor: grey300,
  disabledColor: fade(darkBlack, 0.3),
  pickerHeaderColor: blueGrey500,
  clockCircleColor: fade(darkBlack, 0.07),
  shadowColor: fullBlack,
  }
});


render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <Home />
  </MuiThemeProvider>,
  document.getElementById('root')
);
