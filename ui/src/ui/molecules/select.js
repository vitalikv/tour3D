import React from 'react';
import styled from 'styled-components';
import { compose, withStateHandlers, mapProps } from 'recompose';
import * as Icons from '../../outlines/designMenu'

const SelectWrapper = styled.div`
  width: 210px;
  height: 28px;
  border-radius: 4px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1), 0 0 1px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  position: relative;
  z-index: 2;
`

const OptionIcon = styled.div`
  margin-right: 4px;
  margin-left: 4px;
  display: flex;
`

const OptionText = styled.div`
  margin-left: 4px;
`

const OptionView = styled.div`
  display: flex;
  align-items: center;
  color: #515151;
  fill: #269cff;
  font-size: 13px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  height: 100%;
  background-color: #ffffff;
  height: 28px;
  cursor: default;
&:hover {
  background-color: #f0fcfe;
}`

const Selected = styled(OptionView)`
  padding-right: 30px;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  border-bottom: ${({ isOpen }) => isOpen && '1px solid #d8d8d8'};
  border-bottom-left-radius: ${({ isOpen }) => isOpen && '0'};
  border-bottom-right-radius: ${({ isOpen }) => isOpen && '0'};
  fill: ${({ isOpen }) => isOpen ? '#b5b5b5' : '#269cff'};
&:hover {
  background: #ffffff;
}
`

const Down = styled.div`
  width: 30px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  fill: #b5b5b5;
  z-index: 3;
`;

const Options = styled.div`
  overflow: hidden;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1), 0 0 1px 0 rgba(0, 0, 0, 0.1), 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 3;
`

const Option = ({ icon, title, id, ...restProps }) => (
  <OptionView id={id} {...restProps}>
    <OptionIcon>
      <img src={icon} alt={title} />
    </OptionIcon>
    <OptionText>
      {title}
    </OptionText>
  </OptionView>
)
const enchance = compose(
  withStateHandlers({
    selected: 0,
    isOpen: false,
  },
    {
      handleChange: (state, { onChange }) => (id) => {
        if (typeof onChange === 'function') {
          onChange(id);
        }

        return {
          selected: id,
          isOpen: false,
        }
      },
      toggle: ({ isOpen }) => () => ({ isOpen: !isOpen })
    }),
  mapProps(({ options, selected, initialValue, ...restProps }) => {
    const current = selected || initialValue;
    const item = options.find(({ id }) => id === current);
    let title, icon;

    if (item) {
      title = item.title;
      icon = item.image;
    }

    return {
      options,
      selected: current,
      selectedTitle: title,
      selectedIcon: icon,
      ...restProps,
    }
  })
)

const HandleClose = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
`

export const Select = enchance(({ options = [], selectedTitle, selectedIcon, handleChange, isOpen, toggle }) => (
  <SelectWrapper>
    <Selected isOpen={isOpen} onClick={toggle}>
      <OptionIcon>
        <img src={selectedIcon} alt={selectedTitle} />
      </OptionIcon>
      <OptionText>
        {selectedTitle}
      </OptionText>
      <Down>
        <Icons.DownSVG />
      </Down>
    </Selected>
    {isOpen && <Options>
      {options.map(({ image, title, id }) =>
        <Option
          key={id}
          data-id={id}
          icon={image}
          title={title}
          onClick={() => handleChange(id)}
        />
      )}
    </Options>}
    {isOpen && <HandleClose onClick={toggle} />}
  </SelectWrapper>
))
