import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducer from './reducer';
import { API } from './api';
import { nextTutorial } from './features/tutorial/reducers';

const tutorialMiddleware = (store) => (next) => (action) => {
  const state = store.getState();

  if (state.tutorial.on) {
    if (typeof state.tutorial.switchAction === 'object') {
      if (action.type === state.tutorial.switchAction.name) {
        if (Array.isArray(state.tutorial.switchAction.value)
          && action.payload.length) {
          const actionValues = state.tutorial.switchAction.value[0];
          const payloadValues = action.payload[0];
          let allValuesAreCorrect = true;
          const triggerSwitch = state.tutorial.switchAction.passive ? false : true;

          for (let i in actionValues) {
            if (actionValues[i] !== payloadValues[i]) {
              allValuesAreCorrect = false;
            }
          }

          if (allValuesAreCorrect) {
            store.dispatch(nextTutorial(triggerSwitch));
          }
        } else {
          if (action.payload[0] === state.tutorial.switchAction.value) {
            const triggerSwitch = state.tutorial.switchAction.passive ? false : true;

            store.dispatch(nextTutorial(triggerSwitch));
          }
        }
      }
    } else {
      if (action.type === state.tutorial.switchAction) {
        store.dispatch(nextTutorial(true));
      }
    }
  }

  return next(action)
}

export const configureStore = (inititalStore = {}) => {
  let middleware = [thunkMiddleware, tutorialMiddleware];
  const loggerMiddleware = createLogger();

  if (process.env.NODE_ENV === 'development') {
    middleware = [...middleware, loggerMiddleware];
  }

  const store = createStore(reducer, inititalStore,
    applyMiddleware(...middleware)
  );

  API.registerDispatch(store.dispatch, store.getState);

  return store;
}
