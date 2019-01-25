import React from 'react';
import styled from 'styled-components';
import { PropTypes } from 'prop-types';
import { compose, pure, withHandlers } from 'recompose';

import { Slider } from './slider';
import { ButtonPlus, ButtonMinus } from '../atoms';

import { inRange, getAbsoluteValue } from '../../utils';
import { withMouseEvents } from '../../hoc';

const SliderWithControls = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const enchancedButton = compose(
  pure,
  withMouseEvents,
);

const ButtonPlusWithEvents = enchancedButton(ButtonPlus);
const ButtonMinusWithEvents = enchancedButton(ButtonMinus);

const enchance = compose(
  withHandlers({
    increase: ({ onValueChange, inputName, offsetTop = 0.5 }) => () => {
      if (offsetTop <= 0) return false;
      const newValue = offsetTop - 0.01;

      if (typeof onValueChange === 'function') {
        onValueChange({ name: inputName, value: inRange(newValue, 0, 1) });
      }
    },
    decrease: ({ onValueChange, inputName, offsetTop = 0.5 }) => () => {
      if (offsetTop >= 1) return false;
      const newValue = offsetTop + 0.01;

      if (typeof onValueChange === 'function') {
        onValueChange({ name: inputName, value: inRange(newValue, 0, 1) });
      }
    }
  })
);

export const ZoomSlider = enchance(({ increase, decrease, onValueChange, inputName, offsetTop = 0.5 }) => (
  <SliderWithControls>
    <ButtonPlusWithEvents
      handleMouseDown={increase}
      handleMousePressed={increase}
    />
    <Slider
      handleChange={onValueChange}
      offsetTop={getAbsoluteValue(offsetTop, 90)}
      inputName={inputName}
    />
    <ButtonMinusWithEvents
      handleMouseDown={decrease}
      handleMousePressed={decrease}
    />
  </SliderWithControls>
));

ZoomSlider.propTypes = {
  offsetTop: PropTypes.number,
  onValueChange: PropTypes.func
}
