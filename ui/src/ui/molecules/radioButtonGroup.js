import React from 'react';

export const RadioButtonGroup = ({ children, name, handleClick }) => (
  <React.Fragment>
    {
      React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
          handleClick: () => handleClick({ name: name, index: index, children: children }),
        })
      })
    }
  </React.Fragment>
)
