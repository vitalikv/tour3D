import React from 'react';
import { storiesOf } from '@storybook/react';
import { AuthWidget } from './authWidget';

storiesOf('pages', module)
  .add('AuthWidget', () => (
    <AuthWidget />
  ))
