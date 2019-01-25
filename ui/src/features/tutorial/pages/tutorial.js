import React from 'react';
import { compose } from 'redux';
import { TemplateWrapper, BackgroundFade, Divider } from '../atoms/';
import { mapProps } from 'recompose';
import { connect } from 'react-redux';
import { mapTutorialToProps, mapTutorialDispatch } from '../selectors';
import { tutorialSteps } from '../api'
import { withTransition } from '../../../hoc';
import { ControlSection } from '../atoms/controlSection';
import { ButtonNext } from '../atoms/buttonNext';

const enchance = compose(
  connect(mapTutorialToProps, mapTutorialDispatch),
  mapProps((props) => {
    return {
      ...props,
      isMounted: props.isMounted && props.index < tutorialSteps.length,
    }
  }),
  withTransition,
)

function getTutorialTemplate(index) {
  if (index < tutorialSteps.length) {
    const Page = tutorialSteps[index].component;

    return <Page />
  }

  return null
}

function getTutorialStyle(index) {
  if (index < tutorialSteps.length) {
    return tutorialSteps[index].style || {}
  }

  return {}
}

function isLastPage(index) {
  if (index === tutorialSteps.length - 1) {
    return true
  }
}

function getTemplateZindex(index) {
  if (typeof tutorialSteps[index] !== 'undefined') {
    return tutorialSteps[index].zIndex
  }
}

export const Tutorial = enchance(({ index, handleClick }) => (
  <BackgroundFade zIndex={getTemplateZindex(index)}>
    <TemplateWrapper
      {...getTutorialStyle(index)}>
      {getTutorialTemplate(index)}
      <Divider />
      <ControlSection>
        <ButtonNext onClick={handleClick}>{isLastPage(index) ? 'Закрыть' : 'Далее'}</ButtonNext>
      </ControlSection>
    </TemplateWrapper>
  </BackgroundFade>
))
