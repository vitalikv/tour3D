import React from 'react';
import styled from 'styled-components';
import { Button } from '../atoms/button';
import { Video } from '../molecules';
import { ArrowSVG } from '../../../outlines/shared';

const InfoView = styled.div``;

const Link = styled.button`
  border: none;
  background-color: transparent;
  font-size: 24px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.42;
  letter-spacing: normal;
  text-decoration: underline;
  margin: 0;
  padding: 0;
  display: inline;
  cursor: pointer;
  color: inherit;
`

const Header = styled.div`
  font-size: 24px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.42;
  letter-spacing: normal;
  margin-left: 24px;
  margin-top: 16px;
`

const Steps = styled.div`
  display: flex;
  font-size: 16px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.22;
  letter-spacing: normal;
  margin-top: 21px;
`

const FirstStep = styled.div`
  margin-left: 24px;
  width: 245px;
  opacity: ${({ active }) => active ? '1' : '0.4'};
  transition: opacity .3s;

`

const SecondStep = styled.div`
  width: 187px;
  opacity: ${({ active }) => active ? '1' : '0.4'};
  transition: opacity .3s;
`

const Arrow = styled.div`
  width: 56px;
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-left: 10px;
`

const Content = styled.div`
  margin-top: 36px;
  padding-left: 24px;
  padding-right: 24px;
`
const ButtonWrapper = styled.div`
  width: 510px;
  margin-left: 24px;
  margin-right: 24px;
  margin-top: 83px;
`

export const Information = ({ handleClick, handleClose, stage }) => (
  <InfoView>
    <Header>
      Работайте над проектом используя
      <Link onClick={handleClick}>все возможности</Link> Planoplan Editor
    </Header>
    <Steps>
      <FirstStep active={stage !== 'DOWNLOAD'}>
        Зарегистрируйтесь или
        войдите в аккаунт Planoplan
      </FirstStep>
      <Arrow><ArrowSVG /></Arrow>
      <SecondStep active={stage === 'DOWNLOAD'}>
        Скачайте и запустите
        Planoplan Editor
      </SecondStep>
    </Steps>
    <Content>
      <Video>
        <iframe width="510" height="288" src="https://www.youtube.com/embed/Dov6XVFlUVE"
          frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen title="About"></iframe>
      </Video>
    </Content>
    <ButtonWrapper>
      <Button
        inverse={true}
        onClick={handleClose}>
        Закрыть
      </Button>
    </ButtonWrapper>
  </InfoView>
)
