import React from 'react';
import { storiesOf } from '@storybook/react';
import { DesignMenu } from './designMenu';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducer from '../../../reducer';
import { createStore, applyMiddleware } from 'redux';

const store = function (inititalStore = {}) {
  let middleware = [thunkMiddleware];
  const loggerMiddleware = createLogger();

  if (process.env.NODE_ENV === 'development') {
    middleware = [...middleware, loggerMiddleware];
  }

  const store = createStore(reducer, inititalStore,
    applyMiddleware(...middleware)
  );

  return store;
}();

storiesOf('pages', module)
  .addDecorator((story) => <Provider store={store}>{story()}</Provider>)
  .add('DesignMenu', () => (
    <DesignMenu />
  ))
