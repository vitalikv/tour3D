import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  text-align: center;
`;

const Line = styled.div`
  background: linear-gradient(to bottom, #ffffff 9px, #9b9b9b 9px, #9b9b9b 11px, #ffffff 11px);
  width: 100%;
  height: 1em;
  position: absolute;
`

const Text = styled.span`
  position: relative;;
  z-index: 1;
  background-color: #ffffff;
  padding: 0 11px;
  font-size: 16px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #9b9b9b;
`

const Buttons = styled.div`
  display: flex;
  margin-top: 20px;
  width: 100%;
  justify-content: space-between;
`

export const EnterWithSocial = ({ children, ...restProps }) => (
  <Wrapper {...restProps}>
    <Line />
    <Text>Вход с помощью социальных сетей</Text>
    <Buttons>
      {children}
    </Buttons>
  </Wrapper>
)
