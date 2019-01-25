import React from 'react';
import styled from 'styled-components';
import { LiscenAgreement } from '../molecules';
import { Button } from '../atoms/button';
import { compose, withStateHandlers } from 'recompose';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, IconButton, withStyles } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { withFocusedStyles, withValidation } from '../../../hoc';
import { InputFieldWithValidation } from './inputFieldWithValidation';
import { ErrorText } from '../atoms';

const Wrapper = styled.div`
  position: absolute;
  opacity: ${({ visible }) => visible ? 1 : 0};
  transition: opacity .3s;
  pointer-events: ${({ visible }) => visible ? 'auto' : 'none'};
`;

const Form = styled.form``

const enchance = compose(
  withStateHandlers({
    email: '',
    password: '',
    emailCorrect: false,
    passwordCorrect: false,
    showPassword: false,
    disabled: false,
    agreement: false,
  }, {
      handleEmailChange: ({ password, passwordCorrect, agreement }) => (event) => {
        const { value, isValid } = event;

        return {
          email: value,
          emailCorrect: isValid,
          disabled: !!((value || password) && (!isValid || !passwordCorrect || !agreement)),
        }
      },
      handlePasswordChange: ({ email, emailCorrect, agreement }) => (event) => {
        const { value, isValid } = event;

        return {
          password: value,
          passwordCorrect: isValid,
          disabled: !!((email || value) && (!emailCorrect || !isValid || !agreement)),
        }
      },
      handleFormSubmit: ({ email, password, passwordCorrect, emailCorrect, agreement }, { handleSubmit }) => (event) => {
        event.preventDefault();

        if (!passwordCorrect || !emailCorrect || !agreement) return;

        if (typeof handleSubmit === 'function') {
          handleSubmit({ email, password });
        }
      },
      handleAgreemntClick: ({ agreement, password, emailCorrect, passwordCorrect, email }) => () => {
        return {
          agreement: !agreement,
          disabled: !!((email || password) && (!emailCorrect || !passwordCorrect || agreement)),
        }
      },
      handleClickShowPassword: ({ showPassword }) => () => ({ showPassword: !showPassword }),
    }
  )
)

const StyledTextField = compose(
  withStyles({
    cssOutlinedInput: {
      '&$cssFocused $notchedOutline': {
        borderColor: `#269cff !important`,
      }
    },
    cssFocused: {
    },
    notchedOutline: {},
    cssLabel: {
      '&$cssFocused': {
        color: '#808080'
      },
    },
  }),
  withFocusedStyles,
)(TextField);

const EnchancedPassword = compose(
  InputFieldWithValidation,
  withValidation,
)(StyledTextField);

const EnchancedEmail = InputFieldWithValidation(StyledTextField)

export const RegisterForm = enchance((
  { visible, email, password, handleEmailChange, disabled, handlePasswordChange, handleFormSubmit, showPassword,
    handleClickShowPassword, handleAgreemntClick, agreement, errorText }) => (
    <Wrapper visible={visible}>
      <Form onSubmit={handleFormSubmit}>
        <EnchancedEmail
          id="regEmail"
          label="Email"
          type="email"
          name="email"
          margin="normal"
          value={email}
          fullWidth
          style={{ marginTop: '30px', marginBottom: '10px', }}
          onChange={handleEmailChange}
          regexp={/^[-+\w.]+@([A-zА-я0-9]+\.)+[A-zА-я]{2,}$/}
          variant="outlined" />
        <EnchancedPassword
          id="regPassword"
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          label="Пароль"
          value={password}
          onChange={handlePasswordChange}
          fullWidth
          style={{ marginTop: '10px', marginBottom: '6px', }}
          regexp={/.{5,}/}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={handleClickShowPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }} />
        <ErrorText>{errorText}</ErrorText>
        <LiscenAgreement
          id="reg-agreement"
          handleClick={handleAgreemntClick}
          value={agreement} />
        <Button disabled={disabled}>Зарегистрироваться и сохранить проект</Button>
      </Form>
    </Wrapper>
  ))
