import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { Provider } from 'react-redux';

import { configureStore } from './store';
import { UIInvokeFunction } from './api/UIInvokeFunction';
import { Main } from './ui/pages';

const store = configureStore();
window.UIInvokeFunction = UIInvokeFunction;

export const App = () => (
  <Provider store={store}>
    <React.Fragment>
      <Main />
      <GlobalStyle />
    </React.Fragment>
  </Provider>
);

const GlobalStyle = createGlobalStyle`
  html, body {
    background: transparent;
    margin: 0;
    font-family: 'Montserrat', sans-serif;
  }

  * {
    box-sizing: border-box;
  }  
`
