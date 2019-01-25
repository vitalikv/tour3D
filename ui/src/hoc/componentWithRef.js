import React from 'react';

export const componentWithRef = (Component) => ({ withRef, ...props }) => (
  <div ref={withRef} style={{ width: '100%' }}>
    <Component {...props} />
  </div>
);
