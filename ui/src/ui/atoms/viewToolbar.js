import styled from 'styled-components';

export const ViewToolBarView = styled.div`
  position: fixed;
  right: ${({ visible }) => visible ? 0 : '-45px'};
  top: 0;
  bottom: 0;
  width: 45px;
  border-left: 1px solid #bcb5b9;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3px;
  padding-bottom: 3px;
  background: #ffffff;
  z-index: 10;
  transition: right .3s;
  &>* {
    user-select: none;
  }
`;

export const TopSection = styled.div`
  margin-top: 0;
`;

export const CenterSection = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  display: ${({ disabled }) => disabled ? 'none' : 'block'}
`;

export const Group = styled.div`
  margin-bottom: 34px;
`

export const BottomSection = styled.div`
  margin-bottom: 0;
  height: ${({ height }) => height};
`;
