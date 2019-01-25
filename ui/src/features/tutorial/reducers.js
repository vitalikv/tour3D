import { createSymbiote } from 'redux-symbiote'
import { tutorialSteps } from './api';

const initialState = {
  visible: false,
  index: 0,
  switchAction: '',
  on: true,
}

export const { actions, reducer } = createSymbiote(initialState, {
  setTutorial: (state, index, switchAction) => {
    return {
      ...state,
      index,
      switchAction,
    }
  },
  hideTutorial: (state) => {
    return {
      ...state,
      visible: false,
    }
  },
  showTutorial: (state) => {
    return {
      ...state,
      visible: true,
    }
  }
})

export const nextTutorial = (switchAction) => (dispatch, getState) => {
  let { tutorial } = getState();
  const newIndex = tutorial.index + 1;

  if (typeof tutorialSteps[tutorial.index].onEnd === 'function') {
    if (!tutorialSteps[tutorial.index].delay
      || (tutorialSteps[tutorial.index].delay && !switchAction)) {
      tutorialSteps[tutorial.index].onEnd(dispatch);
    }
  }

  if (tutorialSteps[tutorial.index].delay && !switchAction) {
    return
  }

  if (newIndex >= tutorialSteps.length) {
    dispatch(actions.hideTutorial());
    return;
  }

  if (typeof tutorialSteps[newIndex].onStart === 'function') {
    tutorialSteps[newIndex].onStart(dispatch);
  }

  dispatch(actions.setTutorial(newIndex, tutorialSteps[newIndex].switchAction))
}
