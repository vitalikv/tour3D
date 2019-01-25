import React from 'react';
import styled, { keyframes } from 'styled-components';
import { PropTypes } from 'prop-types';
import { compose, withStateHandlers } from 'recompose';

export const ButtonView = styled.button.attrs(
  ({ toggled }) => {
    if (toggled) {
      return {
        style: {
          fill: '#269cff',
          color: '#269cff'
        }
      }
    }
  })`
  width: 34px;
  height: 34px;
  padding: 0;
  margin: 5px;
  border: none;
  background-color: transparent;
  fill: #4a4a4a;
  color: #4a4a4a;
  transition: fill .2s, color .2s;
  border-radius: 50%;
  position: relative;
  &:hover {
    fill: #000000;
    color: #000000;
  }
  &:focus {
    outline: none;
  }
  &>* {
    pointer-events: none;
  }
`;

const pulse = keyframes`
  0%,
  29.411764705882355% {
    transform: matrix(1, 0, 0, 1, 0, 0);
    opacity: 1;
    animation-timing-function: ease-in-out;
    box-shadow: 0 0 0 0px #269cff;
  }
  100% {
  transform: matrix(1.5, 0, 0, 1.5, 0, 0);
    opacity: 0;
  }
`

const Hightlight = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #269cff;
  top: 7%;
  left: 5%;
  &:before {
    content: "";
    display: block;
    border-radius: 50%;
    position: absolute;
    width: 30px;
    height: 30px;
    box-shadow: 0 0 0 5px #269cff;
    animation: 1s infinite ${pulse};
  }
`



const enchance = compose(
  withStateHandlers({
    isMouseOver: false
  },
    {
      onMouseEnter: () => () => ({ isMouseOver: true }),
      onMouseLeave: () => () => ({ isMouseOver: false }),
    }),
);


export const Button = enchance(({ onHoverElement, children, isMouseOver, hightlight, ...restProps }) => {
  return (
    <ButtonView {...restProps}>
      {onHoverElement && isMouseOver && !restProps.toggled ? onHoverElement : children}
      {hightlight && <Hightlight />}
    </ButtonView>
  )
});


Button.propTypes = {
  toggled: PropTypes.bool,
  onHoverElement: PropTypes.element
}
