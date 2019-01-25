import React from 'react';
import styled from 'styled-components';
import { Input } from '../atoms/input';

const InputWrapper = styled.div`
  padding: 6px 0;
  margin-top: 20px;
  margin-bottom: 20px;
`

export const EmailInput = ({ ...restProps }) => (
  <InputWrapper>
    <Input
      placeholder="Email"
      {...restProps} />
  </InputWrapper>
)
