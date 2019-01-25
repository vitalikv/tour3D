import React from 'react';
import styled from 'styled-components';
import { PropTypes } from 'prop-types';
import { Image } from './image';

const StyledIcon = styled.span`
  width: 100%;
  height: 100%;
  fill: ${({ fill }) => fill};
  &:hover {
    fill: ${({ hover }) => hover}
  }
`

export const Icon = ({ source }) => (
  <StyledIcon>
    <Image src={source} alt="" />
  </StyledIcon>
);

Icon.propTypes = {
  source: PropTypes.string
}
