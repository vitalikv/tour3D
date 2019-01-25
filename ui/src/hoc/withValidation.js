import React from 'react';
import styled from 'styled-components';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import { declOfNum } from '../utils';


const InputWrapper = styled.div`
  margin-bottom: 10px;
`

const StatusText = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: ${({ color }) => color ? color : '#52dfbc'};
  text-align: center;
`

const Progress = styled.div`
  width: 100%;
  height: 4px;
  position: relative;
  display: block;
  margin-bottom: 4px;
  background-color: #d8d8d8;
&:after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  max-width: 100%;
  width: ${({ progress }) => `${progress}%`};
  background-color: ${({ color }) => color ? color : '#52dfbc'};
}
`

const InputWithStatus = (Component) => ({ statusText, progress, setStatusText, color, ...restProps }) => (
  <InputWrapper>
    <Component {...restProps} />
    {progress !== 0 && <Progress progress={progress} color={color} />}
    {statusText && <StatusText color={color}>{statusText}</StatusText>}
  </InputWrapper>
)

const regexps = [
  {
    regexp: /^.{1,}/,
    message: 'простой',
    color: '#ff6868',
  },
  {
    regexp: /^(?=.*[a-zа-я])(?=.*[A-ZА-Я])/,
    message: 'простой',
    color: '#ff6868',
  },
  {
    regexp: /^(?=.*[a-zа-я])(?=.*[0-9])/,
    message: 'простой',
    color: '#ff6868',
  },
  {
    regexp: /^.{8,}/,
    message: 'средний',
    color: '#52dfbc',
  },
  {
    regexp: /^(?=.*[a-zа-я])(?=.*[A-ZА-Я])(?=.*[0-9]).{5,}/,
    message: 'средний',
    color: '#52dfbc',
  },
  {
    regexp: /^(?=.*[a-zа-я])(?=.*[A-ZА-Я])(?=.*[^\w\s]).{5,}/,
    message: 'средний',
    color: '#52dfbc',
  },
  {
    regexp: /^(?=.*[a-zа-я])(?=.*[A-ZА-Я])(?=.*[0-9]).{8,}/,
    message: 'надежный',
    color: '#52dfbc',
  },
  {
    regexp: /^(?=.*[a-zа-я])(?=.*[A-ZА-Я])(?=.*[0-9])(?=.*[^\w\s]).{8,}/,
    message: 'надежный',
    color: '#52dfbc',
  }
]

function testPassword(value) {
  let result;

  for (let i of regexps) {
    if (value.match(i.regexp)) {
      result = {
        message: i.message,
        color: i.color,
      }
    }
  }

  return result;
}

export const withValidation = compose(
  withStateHandlers({
    statusText: '',
    progress: 0,
    color: '',
  }, {
      setStatusText: () => (event) => {
        const { value } = event.target;
        const progress = 100 / 16 * (value.length);
        const passwordStatus = testPassword(value);
        const symbMessage = declOfNum(value.length, ['символ', 'символа', 'символов']);
        const color = passwordStatus ? passwordStatus.color : '';
        const statusText = passwordStatus ? `${passwordStatus.message}, ${value.length} ${symbMessage}` : '';

        return {
          statusText: statusText,
          progress: progress,
          color: color,
        }
      }
    }),
  withHandlers({
    onChange: ({ onChange, setStatusText }) => (event) => {
      if (typeof onChange === 'function') {
        onChange(event)
      }

      setStatusText(event);
    }
  }),
  InputWithStatus,
)
