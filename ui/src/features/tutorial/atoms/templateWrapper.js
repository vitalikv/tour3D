import styled from 'styled-components';

export const TemplateWrapper = styled.div`
  position: fixed;
  right: ${({ right }) => right};
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  bottom: ${({ bottom }) => bottom};
  width: ${({ width }) => width || '600px'};
  height: ${({ height }) => height || '600px'};
  transition: top .3s, left .3s, right .3s, bottom .3s, width .3s;
  border-radius: 10px;
  -webkit-backdrop-filter: blur(25px);
  backdrop-filter: blur(25px);
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  transform: ${({ transform }) => transform};
`;
