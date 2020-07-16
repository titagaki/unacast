import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '../store/renderer';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Renderer from '../component/renderer';

const muiTheme = createMuiTheme({
  typography: {
    button: {
      textTransform: 'none',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});
ReactDOM.render(
  <Provider store={store()}>
    <MuiThemeProvider theme={muiTheme}>
      <Renderer />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
