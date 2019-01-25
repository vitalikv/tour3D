import { actions, handleUserAction } from './reducer';
// import { createSelector } from 'reselect';

export const mapMainToProps = (state) => state.root;

export const mapMainDispatch = (dispatch) => ({
  handlePreviewHide: (event) => dispatch(actions.hidePreview(event)),
  handleUserAction: (event) => dispatch(handleUserAction(event)),
})
