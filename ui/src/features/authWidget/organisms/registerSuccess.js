import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Picture = styled.div`
  width: 100%;
  height: 234px;
  background-color: #f0fcfe;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-image: url('./images/mailbox.png');
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: 255px 168px;
`

const Header = styled.div`
  font-size: 24px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.42;
  letter-spacing: normal;
  margin-top: 74px;
`

const Text = styled.div`
  font-size: 20px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.7;
  letter-spacing: normal;
  margin-top: 56px;
`

const Content = styled.div`
  margin-left: 35px;
  margin-right: 35px;
`

export const RegisterSuccess = () => (
  <Wrapper>
    <Picture />
    <Content>
    <Header>Поздравляем!</Header>
    <Text>
      На вашу почту придет письмо со ссылкой
  для автоматической авторизации в Planoplan Editor.
  Перейдите по ней после установки редактора.
  <br/>  <br/>
  Эту страницу можно закрыть.
</Text>
</Content>
  </Wrapper>
)
