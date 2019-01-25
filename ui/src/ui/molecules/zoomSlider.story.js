import React from 'react';
import { storiesOf } from '@storybook/react';
import { ZoomSlider as ZoomSliderView } from './zoomSlider';

import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducer from '../../reducer';
import { createStore, applyMiddleware, compose } from 'redux';
import { withHandlers } from 'recompose';
import { actions } from '../../features/toolbars/reducers';
import * as buttons from '../../features/toolbars/buttons'

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

const mapZoomSliderStateToProps = ({ toolbars }) => ({
  offsetTop: toolbars[buttons.CAMERA_ZOOM]
});

const enchancedInput = compose(
  connect(mapZoomSliderStateToProps),
  withHandlers({
    onValueChange: ({ dispatch, inputName }) => (value) => dispatch(actions.uiHandleInputChange(value))
  })
);

const ZoomSlider = enchancedInput(ZoomSliderView);

storiesOf('molecules', module)
  .addDecorator((story) => <Provider store={store}>{story()}</Provider>)
  .add('ZoomSlider', () => (
    <ZoomSlider inputName={buttons.CAMERA_ZOOM} />
  ))
