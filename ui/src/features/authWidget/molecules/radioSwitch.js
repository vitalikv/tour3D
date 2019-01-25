import React from 'react';
import styled from 'styled-components';
import { compose } from 'redux';
import { withStateHandlers, mapProps } from 'recompose';

const Wrapper = styled.div`
  width: 508px;
  display: flex;
  border-radius: 30px;
  height: 50px;
  overflow: hidden;
`;

const Label = styled.label`
  display: flex;
  background-color: #f5f7f6;
  width: 254px;
  height: 50px;
  justify-content: center;
  align-items: center;
  color: #4a4a4a;
  transition: color .2s, background-color .2s;
  font-size: 22px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  &:nth-child(2) {
    margin-right: 2px;
  }
`

const Input = styled.input`
  position: absolute; 
  opacity: 0;
  &:checked+${Label} {
    background-color: #269cff;
    color: #ffffff;
  }
`


const InputWrapper = styled.div``

const enchance = compose(
  withStateHandlers({
    value: null,
  },
    {
      setValue: (state, { handleChange }) => (value) => {
        if (typeof handleChange === 'function') {
          handleChange(value);
        }
        return { value: value }
      }
    }),
  mapProps(({ value, initialValue, ...restProps }) => ({
    value: value ? value : initialValue,
    ...restProps
  }))
)

const RadioInput = ({ id, text, ...restProps }) => (
  <InputWrapper>
    <Input
      id={id}
      type="radio"
      {...restProps}
    />
    <Label htmlFor={id}>{text}</Label>
  </InputWrapper>
)

export const RadioSwitch = enchance(({ setValue, value }) => (
  <Wrapper>
    <RadioInput
      name="authSwitch"
      id="REG"
      text="Регистрация"
      checked={value === 'REG'}
      onChange={() => setValue('REG')} />
    <RadioInput
      name="authSwitch"
      id="AUTH"
      checked={value === 'AUTH'}
      onChange={() => setValue('AUTH')}
      text="Вход" />
  </Wrapper>
))
