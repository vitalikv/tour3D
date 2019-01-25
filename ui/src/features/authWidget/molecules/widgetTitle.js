import React from 'react';
import styled from 'styled-components';
import { DisketeSVG, CloseSVG } from '../../../outlines/shared';

const WidgetTitleView = styled.div`
  height: 100%;
  fill: ${({ open }) => open ? '#ffffff' : '#269cff'};
  display: flex;
  align-items: center;
  cursor: default;
`;

const Icon = styled.div`
  margin-left: 24px;
  margin-right: 24px;
`

const Text = styled.div`
  margin-left: 24px;
  margin-right: 24px;
`

const Bold = styled.div`
  font-weight: 500;
`

const CloseButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
`

export const WidgetTitle = ({ open, handleClick }) => (
  <WidgetTitleView
    open={open}
    onClick={open ? handleClick : () => { }}>
    <Icon>
      <DisketeSVG />
    </Icon>
    <Text>
      <Bold>Сохранить и продолжить</Bold>
      в Planoplan Editor
    </Text>
    {open &&
      <CloseButton onClick={handleClick}>
        <CloseSVG/>
      </CloseButton>}
  </WidgetTitleView>
)
