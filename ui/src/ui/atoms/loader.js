import React from 'react';
import styled, { keyframes } from 'styled-components';

const LoaderWrapper = styled.div`
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex; 
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

const animate = keyframes`
  from {
    opacity: 0.5;
    animation-timing-function: ease-in-out;
  }
  to {
    opacity: 1;
  }
`

const LoaderIcon = styled.div`
  display: block;
  width: 80px;
  height: 80px;
`

const LoaderIconUp = styled.div`
  position: absolute;
  top: 0px;
  left: 3px;
  animation-name: ${animate};
  animation-duration: 0.5s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-fill-mode: both;
  animation-play-state: running;
`

const LoaderIconDown = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  animation-name: ${animate};
  animation-duration: 0.5s;
  animation-iteration-count: infinite;
  animation-direction: alternate-reverse;
  animation-fill-mode: both;
  animation-play-state: running;
`

const LoaderBody = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform: scale(0.5);
  width: 80px;
  height: 80px;
  svg {
    fill: #269ffc;
  }
`

export const Loader = () => (
  <LoaderWrapper>
    <LoaderBody>
      <LoaderIcon>
        <LoaderIconUp>
          <svg xmlns="http://www.w3.org/2000/svg" width="74" height="36" viewBox="0 0 74 36">
            <path fillRule="evenodd" d="M17.489 36l10.89-6.554a16.944 16.944 0 0 1 17.477-.01l10.735 6.445 15.03-9.046a4.898 4.898 0 0 0 1.692-1.708c1.378-2.335.618-5.354-1.696-6.743L44.388 2.038a14.255 14.255 0 0 0-14.703.008L2.38 18.48A4.898 4.898 0 0 0 .687 20.19c-1.378 2.334-.618 5.353 1.696 6.743L17.49 36z"
            />
          </svg>
        </LoaderIconUp>
        <LoaderIconDown>
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="52" viewBox="0 0 80 52">
            <path fillRule="evenodd" d="M79.997 26.64L80 0c-.096 1.37-.443 2.686-1.156 3.885a7.63 7.63 0 0 1-2.646 2.651l-27.45 16.395a17.146 17.146 0 0 1-17.57.01L3.806 6.635A7.618 7.618 0 0 1 .174 1.27 8.669 8.669 0 0 1 .003.008L0 26.647a7.636 7.636 0 0 0 3.219 6.23l12.722 7.607 15.276 9.1a17.146 17.146 0 0 0 17.553 0l6.778-4.038 1.442-.863c.37-.253.594-.674.594-1.126V29.808c0-.478.25-.902.66-1.148l7.635-4.547a.476.476 0 0 1 .722.408v13.763a.38.38 0 0 0 .574.326l9.74-5.84a7.636 7.636 0 0 0 3.082-6.13z"
            />
          </svg>
        </LoaderIconDown>
      </LoaderIcon>
    </LoaderBody>
  </LoaderWrapper>
)
