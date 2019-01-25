import styled from 'styled-components';

export const Button = styled.button`
  width: 100%;
  height: 60px;
  border-radius: 5px;
  background-color: ${({ inverse }) => inverse ? 'transparent' : '#269cff'};
  color: ${({ inverse }) => inverse ? '#269cff' : '#ffffff'};
  font-size: 18px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  cursor: pointer;
  border: ${({ inverse }) => inverse ? '1px solid #269cff' : 'none'};
  text-decoration: none;
  font-family: inherit;
  &:disabled {
    opacity: .5;
    cursor: not-allowed;
  }
`;
