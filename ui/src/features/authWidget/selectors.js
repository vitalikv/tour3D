// import { createSelector } from 'reselect';
import { authRequest, regRequest, projectSaveAsNew, hideWidget, vkAuthRequest, fbAuthRequest, actions } from './reducers';

export const selectAuthWidget = (state) => state.authWidget;

export const mapMultiFormDispatch = (dispatch) => ({
  authRequest: ({ email, password }) => dispatch(authRequest({ email, password })),
  regRequest: ({ email, password }) => dispatch(regRequest({ email, password })),
  vkAuthRequest: () => dispatch(vkAuthRequest()),
  fbAuthRequest: () => dispatch(fbAuthRequest()),
})

export const mapAuthWidgetDispatch = (dispatch) => ({
  saveRequest: () => dispatch(projectSaveAsNew()),
  hideWidget: () => dispatch(hideWidget()),
  openWidget: () => dispatch(actions.openWidget()),
})
