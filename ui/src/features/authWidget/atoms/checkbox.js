import React from 'react';
import styled from 'styled-components';

const Label = styled.label`
  display: inline-block;
  width: 60px;
  height: 60px;
  min-width: 60px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 48px 48px;
  border: 1px solid #bebebe;
  border-radius: 5px;
  &:hover {
    border: 1px solid #000000;    
  }
`

export const Input = styled.input`
  opacity: 0;
  position: absolute;
  &:checked+Label {
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4gICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiLz4gICAgICAgIDxwYXRoIGZpbGw9IiMyNjlDRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTkgMTYuMTdMNC44MyAxMmwtMS40MiAxLjQxTDkgMTkgMjEgN2wtMS40MS0xLjQxeiIvPiAgICA8L2c+PC9zdmc+);
  }
`;


export const Checkbox = ({ id, checked, onChange, label, ...restProps }) => (
  <React.Fragment>
    <Input
      id={id}
      checked={checked}
      onChange={onChange}
      {...restProps} />
    <Label htmlFor={id} />
  </React.Fragment>
)
