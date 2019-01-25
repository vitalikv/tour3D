import { createSymbiote } from 'redux-symbiote'
import { mappedButtons } from './buttons/mapButtons';
import { invokeEditorAction } from '../../api';

const initialState = {
  viewMode: '2D',
  SET_VIEW_2D: true,
  hlButton: null,
};

export const { actions, reducer } = createSymbiote(initialState, {
  uiButtonPressed:
    (state, { name }) => { invokeEditorAction(mappedButtons[name]); return { ...state } },
  uiToggleButtonPressed:
    (state, { name, toggled }) => {
      invokeEditorAction({ name: mappedButtons[name].name, value: toggled });

      return { ...state, [name]: toggled }
    },
  uiHandleInputChange:
    (state, { name, value }) => {
      invokeEditorAction({ name: mappedButtons[name].name, value: value });

      return { ...state, [name]: value }
    },
  uiMouseEnter: (state) => {
    invokeEditorAction({ name: 'PointerOnInterface', value: 1 });
    return { ...state, pointerOnInterface: 1 }
  },
  uiMouseLeave:
    (state) => {
      invokeEditorAction({ name: 'PointerOnInterface', value: 0 });
      return { ...state, pointerOnInterface: 0 }
    },
  uiSetRadioButton:
    (state, name, index, children) => {
      const radioButtons = children.reduce((acc, current, i) => {
        acc[current.props.buttonName] = (index === i);
        return acc;
      }, {});

      invokeEditorAction(mappedButtons[children[index].props.buttonName]);

      return { ...state, ...radioButtons, [name]: children[index].props.buttonName }
    },
  uiSetState:
    (state, newState) => {
      return { ...state, ...newState }
    },
  setViewMode:
    (state, value, index, children) => {
      const name = children[index].props.buttonName;
      let viewMode;

      switch (name) {
        case 'SET_VIEW_3D':
          viewMode = '3D';
          break;
        case 'SET_VIEW_2D':
          viewMode = '2D';
          break;
        default:
          viewMode = '2D';
      }

      return {
        ...state,
        viewMode
      }
    },
  setViewMode3D: (state) => {
    return {
      ...state,
    }
  },
  setViewMode2D: (state) => {
    return {
      ...state,
    }
  },
  hightlightButton: (state, buttonName) => {
    return {
      ...state,
      hlButton: buttonName,
    }
  },
  removeHightlightFromButton: (state) => {
    return {
      ...state,
      hlButton: null,
    }
  }
}, 'toolbars');
