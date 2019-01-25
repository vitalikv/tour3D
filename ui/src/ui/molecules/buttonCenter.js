import { ButtonCenter as ButtonCenterView } from '../atoms';
import { compose, withHandlers } from 'recompose';

export const ButtonCenter = compose(
  withHandlers({
    onClick: ({ handleClick, buttonName }) => () => {
      if (typeof handleClick === 'function') {
        handleClick({ name: buttonName });
      }
    }
  })
)(ButtonCenterView);
