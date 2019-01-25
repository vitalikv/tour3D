import React from 'react';
import styled from 'styled-components';

import { PlusSVG } from '../../outlines/toolbars/viewToolbar'

const ButtonPlusView = styled.button`
  width: 16px;
  height: 16px;
  padding: 0;
  margin: 5px;
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

export const ButtonPlus = (props) => (
  <ButtonPlusView {...props}>
    <PlusSVG />
  </ButtonPlusView>
);
