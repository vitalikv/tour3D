import React from 'react';
import { compose, withStateHandlers } from 'recompose';

const withValidation = (Component) => ({ isValid, wasChanged, ...restProps }) => (
  <Component error={!isValid} {...restProps} />
)
export const InputFieldWithValidation = compose(
  withStateHandlers({
    value: '',
    isValid: true,
    wasChanged: false,
  }, {
      onChange: ({ wasChanged }, { onChange, regexp }) => (event) => {
        const { value } = event.target;
        const isValid = (value.match(regexp)) ? true : false;
        const showError = wasChanged ? isValid : true;

        onChange({
          value,
          isValid,
          wasChanged,
        });

        return {
          value,
          isValid: showError,
        }
      },
      onBlur: (state, { onBlur, regexp }) => (event) => {
        const { value } = event.target;
        const isValid = (value.match(regexp)) ? true : false;
        const wasChanged = value.length > 0 ? true : false
        const showError = wasChanged ? isValid : true;

        if (typeof onBlur === 'function') {
          onBlur(event);
        }

        return {
          value,
          wasChanged,
          isValid: showError,
        }
      }
    }),
  withValidation
)

