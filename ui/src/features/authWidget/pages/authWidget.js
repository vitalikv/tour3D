import React from 'react';
import styled from 'styled-components';
import { Information } from '../organisms/information';
import { WidgetTitle } from '../molecules/widgetTitle';
import { MultiForm, RegisterSuccess, DownloadPop } from '../organisms';
import { compose, withStateHandlers, mapProps, lifecycle } from 'recompose';
import { AuthSuccessfull } from '../organisms/authSuccessfull';
import { selectAuthWidget, mapAuthWidgetDispatch } from '../selectors';
import { connect } from 'react-redux';
import { BrowserDetect } from '../../../utils/browserDetect';

const Wrapper = styled.div`
  height: ${({ open }) => open ? '750px' : '112px'};
  width: ${({ open }) => open ? '560px' : '480px'};
  background-color: ${({ open }) => open ? '#00000000' : '#ffffffff'};
  transition: height .3s, width .3s, background-color .3s, bottom .3s;
  position: fixed;
  bottom: ${({ visible }) => visible ? '-10px' : '-112px'};
  left: 0;
  border-top-right-radius: 10px;
  z-index: 102;
  overflow: hidden;
  border: ${({ open }) => open ? 'none' : '1px solid #e0e0e0'};
`

const Fade = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 101;
  opacity: 0.9;
  background-color: #000000;
`

const BackLayer = styled.div`
  height: ${({ open }) => open ? '104px' : '102px'};
  z-index: 1;
  font-size: 20px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.4;
  letter-spacing: normal;
  color: ${({ open }) => open ? '#ffffff' : '#4a4a4a'};
  transition: height .3s, color .3s, fill .3s;
`

const MiddleLayer = styled.div`
  position: absolute;
  bottom: ${({ open }) => open ? '0' : '-646px'};
  width: 100%;
  height: 646px;
  background-color: #fafafa;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-shadow: 0 -4px 8px 0 rgba(74, 74, 74, 0.1);
  z-index: 1;
  transition: bottom .3s, height .3s, width .3s, background-color .3s;
`

const FrontLayer = styled.div`
  position: absolute;
  bottom: ${({ open }) => open ? '0' : '-481px'};
  width: 100%;
  height: 481px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-shadow: 0 -4px 8px 0 rgba(74, 74, 74, 0.1);
  background-color: #ffffff;
  z-index: 2;
  transition: bottom .3s, height .3s, width .3s, background-color .3s;
`

const ExtraFronLayer = styled.div`
  position: absolute;
  bottom: ${({ open }) => open ? '0' : '-646px'};
  width: 100%;
  height: 646px;
  background-color: #fafafa;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-shadow: 0 -4px 8px 0 rgba(74, 74, 74, 0.1);
  z-index: 1;
  transition: bottom .3s, height .3s, width .3s, background-color .3s;
`

const enchance = compose(
  connect(selectAuthWidget, mapAuthWidgetDispatch),
  withStateHandlers({
    open: false,
    activeLayer: 'FRONT',
    lastActiveLayer: 'FRONT',
    stage: 'AUTH',
    browser: 'Uncknown',
  }, {
      toggle: ({ open, activeLayer }, { authSuccess, regSuccess, hideWidget, openWidget }) => () => {
        if ((authSuccess || regSuccess) && activeLayer === 'EXTRAFRONT') {
          hideWidget();
        }

        openWidget();

        return {
          open: !open
        }
      }
      ,
      setActiveLayer: ({ activeLayer, lastActiveLayer }) => (value) => ({
        lastActiveLayer: activeLayer !== value ? activeLayer : lastActiveLayer,
        activeLayer: value
      }),
      setPrevLayerAsActive: ({ lastActiveLayer }) => () => ({ activeLayer: lastActiveLayer }),
      showDownloadPage: (state, { saveSuccess, saveRequest }) => () => {
        saveRequest();
        if (saveSuccess) {
          return { stage: 'DOWNLOAD' }
        }
      },
      handleSuccessReg: () => () => ({ stage: 'DOWNLOAD' }),
      showSuccessLayer: () => () => ({ activeLayer: 'EXTRAFRONT', lastActiveLayer: 'EXTRAFRONT' }),
      setBrowser: () => (value) => ({ browser: value }),
    }),
  lifecycle({
    componentDidMount() {
      const { setBrowser } = this.props;

      BrowserDetect.init();

      if (BrowserDetect.OS === 'Windows') {
        setBrowser(`${BrowserDetect.OS} ${BrowserDetect.bit}`);
      } else {
        setBrowser(`${BrowserDetect.OS}`);
      }
    }
  }),
  mapProps(({ authSuccess, regSuccess, stage, saveSuccess, ...restProps }) => {
    let stageValue = stage;

    if (authSuccess && stage !== 'DOWNLOAD' && !saveSuccess) {
      stageValue = 'PROJECTSAVE'
    } else if (authSuccess && stage !== 'DOWNLOAD' && saveSuccess) {
      stageValue = 'DOWNLOAD'
    } else if (regSuccess) {
      stageValue = 'DOWNLOAD'
    }

    return {
      authSuccess: authSuccess,
      regSuccess: regSuccess,
      saveSuccess: saveSuccess,
      stage: stageValue,
      ...restProps,
    }
  })
)

export const AuthWidget = enchance((
  { open, activeLayer, toggle, setActiveLayer, setPrevLayerAsActive, authSuccess, stage,
    showDownloadPage, showSuccessLayer, visible, browser, userName, userLastName, userAvatar, saveErrorText }) => (
    <React.Fragment>
      <Wrapper open={open} visible={visible} >
        <BackLayer
          open={open}
          onClick={toggle}>
          <WidgetTitle
            open={open}
            handleClick={toggle} />
        </BackLayer>
        <MiddleLayer open={open}>
          <Information
            stage={stage}
            handleClick={() => setActiveLayer('MIDDLE')}
            handleClose={setPrevLayerAsActive}
          />
        </MiddleLayer>
        <FrontLayer open={open && activeLayer === 'FRONT'}>
          {stage === 'AUTH' &&
            <MultiForm />}
          {stage === 'DOWNLOAD' &&
            <DownloadPop
              showIHashPop={authSuccess}
              handleClick={showSuccessLayer}
              browser={browser} />}
          {stage === 'PROJECTSAVE' &&
            <AuthSuccessfull
              userName={userName}
              userLastName={userLastName}
              userAvatar={userAvatar}
              errorText={saveErrorText}
              handleClick={showDownloadPage} />}
        </FrontLayer>
        <ExtraFronLayer open={open && activeLayer === 'EXTRAFRONT'} >
          <RegisterSuccess />
        </ExtraFronLayer>
      </Wrapper>
      {open && <Fade />}
    </React.Fragment>
  ))
