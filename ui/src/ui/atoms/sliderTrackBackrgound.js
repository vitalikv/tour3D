import React from 'react';
import styled from 'styled-components';
import { pure } from 'recompose';

const SliderTrackWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 110px;
  display: flex;
  justify-content: center;
`;

const SliderTrackMiddle = styled.div`
  position: relative;
  width: 4px;
  height: 110px;
  background-color: #d8d8d8;
  border-radius: 2px;
`;

export const SliderTrackBackrgound = pure((props) => (
  <SliderTrackWrapper {...props}>
    <SliderTrackMiddle></SliderTrackMiddle>
  </SliderTrackWrapper>
));
