import React from 'react';
import styled from 'styled-components';
import { PropTypes } from 'prop-types';

import { SliderSVG } from '../../outlines/toolbars/viewToolbar'

const SliderHandleView = styled.div.attrs(
  ({ offsetTop }) => ({
    style: {
      transform: `translateY(${offsetTop}px)`
    }
  })
)`
  position: absolute;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background-color: transparent;
  stroke: #4a4a4a;
  color: #4a4a4a;
  transition: fill .2s, color .2s;
  left: 50%;
  top: 0;
  margin-left: -12px;
  &:hover {
    stroke: #000000;
    color: #000000;
  }
  &:focus {
    outline: none;
  }
`;

export const SliderHandle = (props) => (
  <SliderHandleView {...props}>
    <SliderSVG />
  </SliderHandleView>
);

SliderHandle.propTypes = {
  offsetTop: PropTypes.number
}
