import React from 'react';
import styled from 'styled-components';
import { AuthForm } from './authForm';
import { RegisterForm } from './registerForm';
import { RadioSwitch } from '../molecules';
import { compose, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import { mapMultiFormDispatch, selectAuthWidget } from '../selectors';

const Wrapper = styled.div`
  position: relative;
`;

const SwitchWrapper = styled.div`
  margin-top: 31px;
  padding-left: 24px;
  padding-right: 24px;
`

const FormWrapper = styled.div`
  position: relative;
  padding-left: 24px;
  padding-right: 24px;
  width: 530px;
`

const enchance = compose(
  connect(selectAuthWidget, mapMultiFormDispatch),
  withStateHandlers({
    currentForm: 'REG',
  }, {
      setCurrentForm: () => (value) => ({ currentForm: value }),
      handleAuthSubmit: (state, { authRequest }) => (value) => {
        if (typeof authRequest === 'function') {
          authRequest(value);
        }
      },
      handleRegSubmit: (state, { regRequest }) => (value) => {
        if (typeof regRequest === 'function') {
          regRequest(value);
        }
      },
    }
  )
)

export const MultiForm = enchance(({ setCurrentForm, currentForm, handleRegSubmit, handleAuthSubmit, authErrorText, 
  regErrorText, vkAuthRequest, fbAuthRequest }) => (
  <Wrapper>
    <SwitchWrapper>
      <RadioSwitch
        handleChange={setCurrentForm}
        initialValue="REG"
      />
    </SwitchWrapper>
    <FormWrapper>
      <AuthForm
        handleSubmit={handleAuthSubmit}
        visible={currentForm === 'AUTH'}
        errorText={authErrorText}
        vkAuthRequest={vkAuthRequest}
        fbAuthRequest={fbAuthRequest} />
      <RegisterForm
        handleSubmit={handleRegSubmit}
        visible={currentForm === 'REG'}
        errorText={regErrorText} />
    </FormWrapper>
  </Wrapper>
))
