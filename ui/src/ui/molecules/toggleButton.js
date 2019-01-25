import { Button } from '../atoms'
import { compose, withHandlers } from 'recompose';

export const ToggleButton = compose(
  withHandlers({
    onClick: ({ toggled, handleClick, buttonName }) => () => {
      const nextValue = !toggled;

      if (typeof handleClick === 'function') {
        handleClick({ name: buttonName, toggled: nextValue });
      }
    }
  })
)(Button);
