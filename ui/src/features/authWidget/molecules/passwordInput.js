import React from 'react';
import styled from 'styled-components';
import { Input } from '../atoms/input';

const InputWrapper = styled.div`
  padding: 6px 0;
  margin-top: 20px;
  margin-bottom: 20px;
`

export const PasswordInput = ({ ...restProps }) => (
  <InputWrapper>
    <Input
      placeholder="Пароль"
      type="password"
      {...restProps} />
  </InputWrapper>
)
