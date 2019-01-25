import React from 'react';
import { connect } from 'react-redux';

import * as buttons from '../buttons';
import * as Icons from '../../../outlines/toolbars/viewToolbar';
import {
  Button as ButtonView,
  ButtonCenter as ButtonCenterView,
  ZoomSlider as ZoomSliderView,
  RadioButtonGroup as RadioButtonGroupView,
} from '../../../ui/molecules';
import {
  mapButtonsStateToProps,
  mapRadioButtonsStateToProps,
  mapZoomSliderStateToProps,
  mapZoomSliderDispatch,
  mapButtonDispatch,
  mapRadioButonsDispatch,
  mapWidgetViewToolbar,
  mapWidgetViewToolbarDispatch,
} from '../selectors';
import { ViewToolBarView, TopSection, CenterSection, BottomSection } from '../../../ui';
import { compose } from 'recompose';

const ButtonCenter = connect(null, mapButtonDispatch)(ButtonCenterView);
const RadioButtonGroup = connect(mapRadioButtonsStateToProps, mapRadioButonsDispatch)(RadioButtonGroupView);
const RadioButton = connect(mapButtonsStateToProps)(ButtonView);
const ZoomSlider = connect(mapZoomSliderStateToProps, mapZoomSliderDispatch)(ZoomSliderView);

const enchance = compose(
  connect(mapWidgetViewToolbar, mapWidgetViewToolbarDispatch)
)

export const WidgetViewToolbar = enchance(({ visible, hlButton, setViewMode2D, setViewMode3D }) => (
  <ViewToolBarView visible={visible}>
    <TopSection>
      <RadioButtonGroup name="VIEW_MODE">
        <RadioButton
          hightlight={hlButton === buttons.SET_VIEW_2D}
          buttonName={buttons.SET_VIEW_2D}
          handleTutorialClick={setViewMode2D}>
          <Icons.View2dSVG />
        </RadioButton>
        <RadioButton 
          hightlight={hlButton === buttons.SET_VIEW_3D}
          buttonName={buttons.SET_VIEW_3D}
          handleTutorialClick={setViewMode3D}>
          <Icons.View3dSVG />
        </RadioButton>
      </RadioButtonGroup>
    </TopSection>
    <CenterSection>
      <ButtonCenter buttonName={buttons.CENTER_VIEW}>
        <Icons.CenterSVG />
      </ButtonCenter>
      <ZoomSlider inputName={buttons.CAMERA_ZOOM} />
    </CenterSection>
    <BottomSection height="150px">
    </BottomSection>
  </ViewToolBarView>
));
