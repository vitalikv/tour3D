// import { createSelector } from 'reselect';
import { actions } from './reducers';
import * as buttons from './buttons';

// export const buttonSelector = createSelector(state => state.toolbars.button, button => button);
export const mapViewToolbarProps = (state) => ({

})

export const mapWidgetViewToolbar = (state) => state.toolbars;

export const mapWidgetViewToolbarDispatch = (dispatch) => ({
  setViewMode2D: () => dispatch(actions.setViewMode2D()),
  setViewMode3D: () => dispatch(actions.setViewMode3D()),
})

export const mapButtonsStateToProps = ({ toolbars }, { buttonName }) => {
  return { toggled: toolbars[buttonName] }
}

export const mapButtonsDispatchToProps = (dispatch) => ({
  handleClick: (value) => dispatch(actions.uiToggleButtonPressed(value)),
})

export const mapRadioButtonsStateToProps = ({ toolbars }, { name }) => {
  return { toggledName: toolbars[name] }
}

export const mapZoomSliderStateToProps = ({ toolbars }) => ({
  offsetTop: toolbars[buttons.CAMERA_ZOOM]
});

export const mapRadioWalkButtonDispatch = (dispatch) => ({
  handleGrabEnd: (value) => {
    dispatch(actions.uiSetState({
      [buttons.SET_VIEW_2D]: false,
      [buttons.SET_VIEW_3D]: false,
      [buttons.SET_WALK_MODE]: true
    }));
    dispatch(actions.uiButtonPressed(value));
  },
})

export const mapToolbarWrapperDispatch = (dispatch) => ({
  onMouseEnter: () => dispatch(actions.uiMouseEnter()),
  onMouseLeave: () => dispatch(actions.uiMouseLeave()),
})

export const mapZoomSliderDispatch = (dispatch) => ({
  onValueChange: ({ name, value }) => dispatch(actions.uiHandleInputChange({ name: name, value: value })),
})

export const mapButtonDispatch = (dispatch) => ({
  handleClick: ({ name }) => dispatch(actions.uiButtonPressed({ name: name })),
})

export const mapRadioButonsDispatch = (dispatch) => ({
  handleClick: ({ name, index, children }) => {
    dispatch(actions.uiSetRadioButton(name, index, children))
    dispatch(actions.setViewMode(name, index, children))
  },
})
