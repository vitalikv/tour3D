import * as Pages from '../pages/tutorialPages';
import { actions as rootActions } from '../../../reducer';
import { actions as tutorialActions, nextTutorial } from '../reducers';

let timeout = null;

export const tutorialSteps = [
  {
    component: Pages.Page1,
    onStart: (dispatch) => {
    },
    switchAction: '',
    style: {
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: '520px',
      height: '272px',
    }
  },
  {
    component: Pages.Page2,
    onStart: (dispatch) => {
    },
    onEnd: (dispatch) => {
      dispatch(tutorialActions.hideTutorial());
      timeout = setTimeout(() => dispatch(nextTutorial(true)), 30000);
    },
    delay: true,
    style: {
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: '520px',
      height: '272px',
    }
  },
  {
    component: Pages.Page3,
    onStart: (dispatch) => {
      clearTimeout(timeout);
      dispatch(tutorialActions.showTutorial());
    },
    onEnd: (dispatch) => {
      dispatch(tutorialActions.hideTutorial());
    },
    switchAction: {
      name: 'root/userClick',
      value: [{ tag: 'room' }]
    },
    delay: true,
    style: {
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: '520px',
      height: '272px',
    }
  },
  {
    component: Pages.Page4,
    onStart: (dispatch) => {
      clearTimeout(timeout);
      dispatch(tutorialActions.showTutorial());
    },
    onEnd: (dispatch) => {
      dispatch(tutorialActions.hideTutorial());
      timeout = setTimeout(() => dispatch(nextTutorial(true)), 30000);
    },
    switchAction: {
      name: 'root/updateMousePosition',
      value: [],
      passive: true,
    },
    delay: true,
    zIndex: 4,
    style: {
      right: '313px',
      top: '74px',
      width: '520px',
      height: '174px',
    }
  },
  {
    component: Pages.Page5,
    onStart: (dispatch) => {
      clearTimeout(timeout);
      dispatch(tutorialActions.showTutorial());
      dispatch(rootActions.showAuthWidget());
    },
    onEnd: (dispatch) => {
      dispatch(tutorialActions.hideTutorial());
    },
    switchAction: 'authWidget/openWidget',
    style: {
      left: '8px',
      bottom: '130px',
      width: '420px',
      height: '172px',
    }
  },
]
