import React from 'react';
import styled from 'styled-components';
import { LiscenAgreement } from '../molecules';
import { Button } from '../atoms/button';
import { compose } from 'redux';
import { withStateHandlers } from 'recompose';
import { ErrorText } from '../atoms';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
  background-color: #ffffff;
`;

const UserInfo = styled.div`
  height: 68px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #4a4a4a;
  margin-top: 50px;
`

const UserPic = styled.div`
  width: 68px;
  height: 68px;
  border-radius: 50%;
  margin-left: 16px;
  margin-right: 16px;
  overflow: hidden;
  background-color: #269cff;
  background-image: ${({url}) => `url(${url})`};
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
`

const Text = styled.div`
  font-size: 18px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  margin-top: 70px;
`

const ControlsWraper = styled.div`
  margin-top: 100px;
  margin-left: 24px;
  margin-right: 24px;
`

const enchance = compose(
  withStateHandlers({
    agreement: false,
  }, {
      toggleAgreement: ({ agreement }) => () => ({ agreement: !agreement })
    })
)

export const AuthSuccessfull = enchance(({ handleClick, errorText, agreement, toggleAgreement, userName, userLastName, userAvatar }) => (
  <Wrapper>
    {userName &&
      <UserInfo>
        Вы вошли как:
        <UserPic url={userAvatar} />
        {`${userName} ${userLastName}`}
      </UserInfo>
    }
    <Text>Текущий проект будет сохранен на ваш аккаунт</Text>
    <ErrorText>{errorText}</ErrorText>
    <ControlsWraper>
      <LiscenAgreement
        value={agreement}
        handleClick={toggleAgreement}
        id="auth-agreement" />
      <Button
        disabled={!agreement}
        onClick={handleClick}>
        Сохранить проект
      </Button>
    </ControlsWraper>
  </Wrapper>
))
