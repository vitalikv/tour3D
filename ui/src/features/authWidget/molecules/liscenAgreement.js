import React from 'react';
import styled from 'styled-components';
import { Checkbox } from '../atoms/checkbox';

const Wrapper = styled.div`
  margin-top: 30px;
  margin-bottom: 20px;
  height: 60px;
  display: flex;
  align-items: center;
`;

const Text = styled.div`
  margin-left: 26px;
  font-size: 14px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.38;
  letter-spacing: normal;
  a {
    color: #269cff;
    text-decoration: none;
  }
`

export const LiscenAgreement = ({ id, value, handleClick }) => (
  <Wrapper>
    <Checkbox
      type="checkbox"
      checked={value}
      onChange={handleClick}
      id={id} />
    <Text>
      <label htmlFor={id}>
        Я прочитал и принимаю условия 
        <a
          href="https://planoplan.com/ru/agreements/"
          target="_blank"
          rel="noopener noreferrer">
          &nbsp;Пользовательского соглашения
         </a> и 
         <a
          href="https://planoplan.com/ru/privacy-policy/"
          target="_blank"
          rel="noopener noreferrer">
          &nbsp;Политики конфиденциальности
          </a>
      </label>
    </Text>
  </Wrapper>
)
