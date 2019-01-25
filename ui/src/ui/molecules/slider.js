import React from 'react';
import styled from 'styled-components';
import { PropTypes } from 'prop-types';
import { withStateHandlers, compose } from 'recompose';

import { SliderTrackBackrgound, SliderHandle } from '../atoms';

import { inRange, getRelativeValue, getOffset } from '../../utils';
import { withRef, componentWithRef, withMouseEvents } from '../../hoc';

const SliderView = styled.div`
  position: relative;
`;

const withMouseControls = withStateHandlers(() => ({
  lastMouseY: 0,
  trackHeight: 90,
  handleRadius: 24 / 2,
}),
  {
    startDrag: ({ trackHeight, handleRadius }, { getRef, handleChange, inputName }) => (event) => {
      const clientY = event.clientY || event.touches[0].clientY;
      const handleOffset = getOffset(getRef()).top;
      const newTrackHandleOffset = inRange(clientY - handleOffset - handleRadius, 0, trackHeight);

      if (typeof handleChange === 'function') {
        handleChange({ name: inputName, value: inRange(getRelativeValue(newTrackHandleOffset, trackHeight), 0, 1) });
      }
      return {
        lastMouseY: clientY,
        trackHandleOffset: newTrackHandleOffset
      }
    },
    onDrag: ({ lastMouseY, trackHeight }, { handleChange, offsetTop, inputName }) => (event) => {
      const clientY = event.clientY || event.touches[0].clientY;
      const newTrackHandleOffset = offsetTop + (clientY - lastMouseY);

      if (typeof handleChange === 'function') {
        handleChange({ name: inputName, value: inRange(getRelativeValue(newTrackHandleOffset, trackHeight), 0, 1) });
      }
      return {
        trackHandleOffset: newTrackHandleOffset,
        lastMouseY: clientY,
      }
    },
    handleMouseWheel: ({ trackHeight }, { handleChange, offsetTop, inputName }) => ({ deltaY }) => {
      const wheelStep = deltaY / 20;
      const newTrackHandleOffset = offsetTop + wheelStep;

      if (typeof handleChange === 'function') {
        handleChange({ name: inputName, value: inRange(getRelativeValue(newTrackHandleOffset, trackHeight), 0, 1) });
      }
      return {
        trackHandleOffset: newTrackHandleOffset
      }
    }
  },
);

const withBindMouseControls = (Component) => ({ startDrag, onDrag, handleMouseWheel, ...restProps }) => (
  <Component
    handleMouseDown={startDrag}
    handleMouseMove={onDrag}
    handleMouseWheel={handleMouseWheel}
    {...restProps}
  />);

const enchance = compose(
  withRef,
  componentWithRef,
  withMouseControls,
  withBindMouseControls,
  withMouseEvents
);

export const Slider = enchance(({ offsetTop, ...restProps }) => (
  <SliderView {...restProps}>
    <SliderTrackBackrgound />
    <SliderHandle offsetTop={inRange(offsetTop, 0, 90)} />
  </SliderView>
));

Slider.propTypes = {
  offsetTop: PropTypes.number,
  handleChange: PropTypes.func
}
