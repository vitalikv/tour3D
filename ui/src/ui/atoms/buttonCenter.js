import React from 'react';
import styled from 'styled-components';

import { CenterSVG } from '../../outlines/toolbars/viewToolbar'

const ButtonCenterView = styled.button`
  width: 24px;
  height: 24px;
  padding: 0;
  margin: 5px auto;
  border: none;
  background-color: transparent;
  fill: #4a4a4a;
  color: #4a4a4a;
  transition: fill .2s, color .2s;
  &:hover {
    fill: #000000;
    color: #000000;
  }
  &:focus {
    outline: none;
  }
`;

export const ButtonCenter = (props) => (
  <ButtonCenterView {...props}>
    <CenterSVG />
  </ButtonCenterView>
);
