import { configure, addDecorator, setAddon } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { setOptions } from '@storybook/addon-options';
import JsxAddon from 'storybook-addon-jsx'
import styled from 'styled-components';

import React from 'react';

const RootDecorator = styled.div`
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,500&subset=cyrillic');
  display: flex;
  flex-flow: row nowrap;
  padding: 30px;
  height: 95%;
  width: 100%;
  position: absolute;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
  background-color: #c0e8ff;
  overflow: hidden;
  & * {
    box-sizing: border-box;
  } 
`
setAddon(JsxAddon)

addDecorator(withKnobs);
addDecorator((fn) => <RootDecorator>{fn()}</RootDecorator>);

setOptions({
  name: 'Editor UI',
  showAddonPanel: true,
  showSearchBox: false,
  sortStoriesByKind: true,
})

configure(() => {
  const req = require.context('../src/', true, /\.story\.js$/)

  req.keys().forEach(req)
}, module)