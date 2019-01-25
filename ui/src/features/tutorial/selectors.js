import { nextTutorial } from './reducers';

export const mapTutorialToProps = (state) => ({
  index: state.tutorial.index,
  isMounted: state.tutorial.visible,
});

export const mapTutorialDispatch = (dispatch) => ({
  handleClick: () => dispatch(nextTutorial()),
})
