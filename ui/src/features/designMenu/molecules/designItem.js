import React from 'react';
import styled from 'styled-components';
import { Loader } from '../../../ui';

const DesignItemWrapper = styled.div`
  width: 210px;
  height: 165px;
  border-radius: 4px;
  background-color: #f4f4f4;
  font-size: 13px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #515151;
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1), 0 0 1px 0 rgba(0, 0, 0, 0.1);
  pointer-events: ${({ loading }) => loading && 'none'};
`

const DesignItemPicture = styled.div`
  border-radius: 4px;
  background-color: #b1b1b1;
  height: 135px;
  position: relative;
  background-image: ${({ image }) => 'url(' + image + ');'};
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
`

const DesignItemCapture = styled.div`
  padding-left: 8px;
  padding-right: 8px;
  line-height: 30px;
  opacity: ${({ loading }) => loading && 0.5};
`

export const DesignItem = ({ image, title, loading, ...restProps }) => (
  <DesignItemWrapper loading={loading} {...restProps}>
    <DesignItemPicture image={image}>
      {loading && <Loader />}
    </DesignItemPicture>
    <DesignItemCapture loading={loading}>
      {title}
    </DesignItemCapture>
  </DesignItemWrapper>
)
