import React from 'react';
import styled from 'styled-components';
import { PopLiteSVG } from '../../outlines/shared';

const Wrapper = styled.div`
  position: fixed;
  left: 16px;
  top: 13px;
  z-index: 100;
  svg {
    font-family: 'Montserrat', sans-serif;
  }
  a {
    text-decoration: none;
  }
`

export const PopIcon = () => (
  <Wrapper>
    <a href="https://planoplan.com">
      <PopLiteSVG/>
    </a>
  </Wrapper>
)
