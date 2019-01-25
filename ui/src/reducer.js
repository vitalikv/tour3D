import { reducer as toolbars } from './features/toolbars/reducers';
import { reducer as designMenu } from './features/designMenu/reducers';
import { reducer as authWidget } from './features/authWidget/reducers';
import { reducer as tutorial } from './features/tutorial/reducers';
import { combineReducers } from 'redux';
import { createSymbiote } from 'redux-symbiote';
import { invokeEditorAction } from './api';

const initialState = {
  toolbarsVisible: true,
  designMenuVisible: false,
  cursorPreview: false,
  avaitingUserAction: true,
  authWidgetVisible: true,
}

export const { actions, reducer } = createSymbiote(initialState, {
  showPreviewAtCursor: (state, value) => ({ ...state, cursorPreview: value, }),
  hidePreviewAtCursor: (state) => ({ ...state, cursorPreview: false, }),
  updateMousePosition: (state, { clientX, clientY }) => {
    return {
      ...state,
      mouseX: clientX,
      mouseY: clientY,
    }
  },
  hidePreview: (state, { clientX, clientY, button, changedTouches }) => {
    invokeEditorAction({
      name: 'MouseClick',
      value: {
        clientX,
        clientY,
        button,
        changedTouches
      }
    });

    return {
      ...state,
      cursorPreview: false,
    }
  },
  hideToolbar: (state) => ({
    ...state,
    toolbarsVisible: false,
  }),
  showToolbar: (state) => ({
    ...state,
    toolbarsVisible: true,
  }),
  hideDesignMenu: (state) => ({
    ...state,
    designMenuVisible: false,
  }),
  showDesignMenu: (state) => ({
    ...state,
    designMenuVisible: true,
  }),
  hideAuthWidget: (state) => ({
    ...state,
    authWidgetVisible: false,
  }),
  showAuthWidget: (state) => ({
    ...state,
    authWidgetVisible: true,
  }),
  cameraMove: (state) => ({
    ...state,
  }),
  objectMove: (state) => ({
    ...state,
  }),
  userClick: (state, value = {}) => {
    const { tag } = value;

    if (tag === 'room') {
      return {
        ...state,
        designMenuVisible: true,
        toolbarsVisible: true,
      }
    } else {
      return {
        ...state,
        designMenuVisible: false,
      }
    }
  },
}, 'root');

export default combineReducers({
  root: reducer,
  toolbars,
  designMenu,
  authWidget,
  tutorial,
});


export const handleUserAction = ({ clientX, clientY }) => (dispatch) => {
  dispatch(actions.updateMousePosition({ clientX, clientY }));
}
