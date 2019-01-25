import React from 'react';
import { storiesOf } from '@storybook/react';
import { Slider } from './slider';
import { Provider } from 'react-redux';
import { configureStore } from '../../store';
import { number } from '@storybook/addon-knobs';

const store = configureStore({ toolbars: { CAMERA_ZOOM: 45 } });

storiesOf('molecules', module)
  .addDecorator((story) => <Provider store={store}>{story()}</Provider>)
  .add('Slider', () => (
    <Slider offsetTop={number('offsetTop', 45)} />
  ))
