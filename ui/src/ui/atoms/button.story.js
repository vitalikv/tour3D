import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from './button';

import { WalkSVG, WalkHoverSVG } from '../../outlines/toolbars/viewToolbar'

storiesOf('atoms', module)
  .add('Button', () => (
    <Button onHoverElement={WalkHoverSVG()}>
      <WalkSVG/>
    </Button>
  ))
