import { Button as ButtonView } from '../atoms';
import { compose, withHandlers } from 'recompose';
import { withGrab } from '../../hoc';

export const RadioWalkButton = compose(
  withHandlers({
    onGrabEnd: ({ handleGrabEnd, buttonName }) => () => {
      if (typeof handleGrabEnd === 'function') {
        handleGrabEnd({ name: buttonName });
      }
    }
  }),
  withGrab,
)(ButtonView);
