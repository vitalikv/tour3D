import styled from 'styled-components';

export const SocialAuth = styled.button`
  height: 60px;
  max-width: calc(50% - 4px);
  width: calc(50% - 4px);
  border-radius: 5px;
  background-color: ${({ color }) => color};
  border: none;
  font-size: 20px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #ffffff;
  cursor: pointer;
`;
