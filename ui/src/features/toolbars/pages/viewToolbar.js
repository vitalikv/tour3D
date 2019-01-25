import React from 'react';
import { connect } from 'react-redux';

import * as buttons from '../buttons';
import * as Icons from '../../../outlines/toolbars/viewToolbar/index';
import {
  ToggleButton as ToggleButtonView,
  Button as ButtonView,
  RadioWalkButton as RadioWalkButtonView,
  ButtonCenter as ButtonCenterView,
  ZoomSlider as ZoomSliderView,
  RadioButtonGroup as RadioButtonGroupView,
} from '../../../ui/molecules';
import {
  mapButtonsStateToProps,
  mapRadioButtonsStateToProps,
  mapZoomSliderStateToProps,
  mapButtonsDispatchToProps,
  mapRadioWalkButtonDispatch,
  mapZoomSliderDispatch,
  mapButtonDispatch,
  mapRadioButonsDispatch,
} from '../selectors';
import { ViewToolBarView, TopSection, CenterSection, BottomSection, Group } from '../../../ui';

const Button = connect(null, mapButtonDispatch)(ButtonView);
const ButtonCenter = connect(null, mapButtonDispatch)(ButtonCenterView);
const RadioWalkButton = connect(mapButtonsStateToProps, mapRadioWalkButtonDispatch)(RadioWalkButtonView);
const ToggleButton = connect(mapButtonsStateToProps, mapButtonsDispatchToProps)(ToggleButtonView);
const RadioButtonGroup = connect(mapRadioButtonsStateToProps, mapRadioButonsDispatch)(RadioButtonGroupView);
const RadioButton = connect(mapButtonsStateToProps)(ButtonView);
const ZoomSlider = connect(mapZoomSliderStateToProps, mapZoomSliderDispatch)(ZoomSliderView);

export const ViewToolbar = () => (
  <ViewToolBarView>
    <TopSection>
      <RadioButtonGroup name="VIEW_MODE">
        <RadioButton
          buttonName={buttons.SET_VIEW_2D}
          hightlight={true}>
          <Icons.View2dSVG />
        </RadioButton>
        <RadioButton buttonName={buttons.SET_VIEW_3D}>
          <Icons.View3dSVG />
        </RadioButton>
        <RadioWalkButton
          buttonName={buttons.SET_WALK_MODE}
          onHoverElement={Icons.WalkHoverSVG()}>
          <Icons.WalkSVG />
        </RadioWalkButton>
      </RadioButtonGroup>
    </TopSection>
    <CenterSection>
      <ButtonCenter buttonName={buttons.CENTER_VIEW}>
        <Icons.CenterSVG />
      </ButtonCenter>
      <ZoomSlider inputName={buttons.CAMERA_ZOOM} />
    </CenterSection>
    <BottomSection>
      <Group>
        <ToggleButton buttonName={buttons.SHOW_CUSTOM_CAMERAS}>
          <Icons.CameraSVG />
        </ToggleButton>
        <ToggleButton buttonName={buttons.SET_SUN}>
          <Icons.SunSVG />
        </ToggleButton>
        <ToggleButton buttonName={buttons.SHOW_GRID}>
          <Icons.GridOnSVG />
        </ToggleButton>
      </Group>
      <Button buttonName={buttons.GET_INFO_FOR_BUG_REPORT}>
        <Icons.BugSVG />
      </Button>
      <Button buttonName={buttons.SHOW_HELP}>
        <Icons.HelpSVG />
      </Button>
    </BottomSection>
  </ViewToolBarView>
);
