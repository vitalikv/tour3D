import React from 'react';

export const withFocusedStyles = (Component) => ({ InputProps, classes, ...restProps }) => {
  return <Component
    InputProps={{
      ...InputProps,
      classes: {
        root: classes && classes.cssOutlinedInput,
        focused: classes && classes.cssFocused,
        notchedOutline: classes && classes.notchedOutline,
      },
    }}
    InputLabelProps={{
      classes: {
        root: classes && classes.cssLabel,
        focused: classes && classes.cssFocused,
      },
    }}
    {...restProps} />
}
