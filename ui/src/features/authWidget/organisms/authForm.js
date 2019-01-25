import React from 'react';
import styled from 'styled-components';
import { Button } from '../atoms/button';
import { EnterWithSocial } from '../atoms/enterWithSocial';
import { SocialAuth } from '../atoms/socialAuth';
import { compose, withStateHandlers } from 'recompose';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, IconButton, withStyles } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { withFocusedStyles } from '../../../hoc';
import { InputFieldWithValidation } from './inputFieldWithValidation';

const Wrapper = styled.div`
  position: absolute;
  opacity: ${({ visible }) => visible ? 1 : 0};
  transition: opacity .3s;
  pointer-events: ${({ visible }) => visible ? 'auto' : 'none'};
`;

const ButtonWrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`

const Form = styled.form``

const enchance = compose(
  withStateHandlers({
    email: '',
    password: '',
    emailCorrect: false,
    passwordCorrect: true,
    showPassword: false,
    disabled: false,
  }, {
      handleEmailChange: ({ password, passwordCorrect }) => (event) => {
        const { value, isValid } = event;

        return {
          email: value,
          emailCorrect: isValid,
          disabled: !!((value || password) && (!isValid || !passwordCorrect)),
        }
      },
      handelPasswordChange: ({ email, emailCorrect, passwordCorrect }) => (event) => {
        const { value } = event.target;

        return {
          password: value,
          passwordCorrect,
          disabled: !!((email || value) && (!emailCorrect || !passwordCorrect)),
        }
      },
      handleFormSubmit: ({ email, password, emailCorrect, passwordCorrect }, { handleSubmit }) => (event) => {
        event.preventDefault();

        if (!emailCorrect || !passwordCorrect) return;

        if (typeof handleSubmit === 'function') {
          handleSubmit({ email, password });
        }
      },
      handleClickShowPassword: ({ showPassword }) => () => ({ showPassword: !showPassword }),
    },
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

const ErrorText = styled.div`
  font-size: .8em;
  color: red;
  text-align: center;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`
const EnchancedEmail = InputFieldWithValidation(StyledTextField)

export const AuthForm = enchance((
  { visible, email, password, disabled, handleEmailChange, handelPasswordChange, handleFormSubmit,
    handleClickShowPassword, showPassword, errorText, vkAuthRequest, fbAuthRequest }) => (
    <Wrapper visible={visible}>
      <Form onSubmit={handleFormSubmit}>
        <EnchancedEmail
          id="authEmail"
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          margin="normal"
          value={email}
          onChange={handleEmailChange}
          fullWidth
          style={{ marginTop: '30px', marginBottom: '10px', }}
          regexp={/^[-+\w.]+@([A-zА-я0-9]+\.)+[A-zА-я]{2,}$/}
          variant="outlined" />
        <StyledTextField
          id="authPassword"
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          label="Пароль"
          value={password}
          onChange={handelPasswordChange}
          fullWidth
          style={{ marginTop: '10px', marginBottom: '10px', }}
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
        <ButtonWrapper>
          <Button disabled={disabled}>Войти и сохранить проект</Button>
        </ButtonWrapper>
      </Form>
      <EnterWithSocial>
        {/* <SocialAuth color="#e46552">Google</SocialAuth> */}
        <SocialAuth color="#6b82b4" onClick={fbAuthRequest}>Facebook</SocialAuth>
        <SocialAuth color="#54789f" onClick={vkAuthRequest}>Вконтакте</SocialAuth>
      </EnterWithSocial>
    </Wrapper>
  ))
