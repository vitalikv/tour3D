import React from 'react';
import styled from 'styled-components';
import { Picture } from '../../../ui/atoms';
import { LinkAsButton } from '../atoms';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #ffffff;
`;

const ImageWrapper = styled.div`
  margin-top: 30px;
  margin-left: 24px;
  width: 510px;
  height: 287px;
  margin-bottom: 44px;
`

const Image = styled.div`
  background-color: #bebebe;
  width: 100%;
  height: 100%;
  position: relative;
  img {
    max-width: 100%;
  }
`

const PopLogo = styled.div`
  position: absolute;
  left: 0;
  bottom: -31px;
  width: 80px;
  height: 78px;
`

const Link = styled.button`
  font-size: 16px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #269cff;
  background:transparent;
  border: none;
  margin-top: 20px;
  font-family: inherit;
`

const ButtonWrapper = styled.div`
  margin-left: 24px;
  margin-right: 24px;
  text-align: center;
`

export const DownloadPop = ({ handleClick, browser, showIHashPop }) => (
  <Wrapper>
    <ImageWrapper>
      <Image>
        <Picture
          src="./images/app-pic.jpg"
          alt="app" />
        <PopLogo>
          <Picture
            src="./images/pop-app.png"
            alt="pop"
          />
        </PopLogo>
      </Image>
    </ImageWrapper>
    <ButtonWrapper>
      <LinkAsButton href={getEditorLink(browser)} onClick={handleClick}>Скачать Planoplan Editor для {getOsName(browser)}</LinkAsButton>
      {showIHashPop && <Link onClick={handleClick}>У меня уже есть Planoplan Editor</Link>}
    </ButtonWrapper>
  </Wrapper>
)

function getEditorLink(browser) {
  switch (browser) {
    case 'Mac':
      return 'https://files.planoplan.com/upload/standalone_build/en/PlanoplanEditorSetup.pkg';
    case 'Windows x32':
      return 'https://files.planoplan.com/upload/standalone_build/ru/PlanoplanEditorSetup_x86.msi';
    case 'Windows x64':
      return 'https://files.planoplan.com/upload/standalone_build/ru/PlanoplanEditorSetup.msi';
    default:
      return 'https://files.planoplan.com/upload/standalone_build/ru/PlanoplanEditorSetup.msi';
  }
}

function getOsName(browser) {
  switch (browser) {
    case 'Mac':
      return 'macOS';
    case 'Windows x32':
      return 'Windows x86';
    case 'Windows x64':
      return 'Windows';
    default:
      return 'Windows';
  }
}
