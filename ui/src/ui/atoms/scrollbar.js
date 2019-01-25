import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';


export const Scrollbar = ({ children, ...restProps }) => (
  <Scrollbars
    renderTrackVertical={(props) => <div
      {...props}
      className="track-vertical"
      style={{
        position: 'absolute',
        width: '6px',
        right: '5px',
        bottom: '2px',
        top: '2px',
        borderRadius: '3px',
      }}
    />}
    {...restProps} >
    {children}
  </Scrollbars >
)
