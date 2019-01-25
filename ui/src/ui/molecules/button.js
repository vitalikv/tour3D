import { Button as ButtonView } from '../atoms';
import { compose, withHandlers } from 'recompose';

export const Button = compose(
  withHandlers({
    onClick: ({ handleClick, buttonName, hightlight, handleTutorialClick }) => () => {
      if (typeof handleClick === 'function') {
        handleClick({ name: buttonName });
      }

      if (hightlight && typeof handleTutorialClick === 'function') {
        handleTutorialClick();
      }
    }
  })
)(ButtonView);
