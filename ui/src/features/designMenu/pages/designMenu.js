import React from 'react';
import styled from 'styled-components';
import { Scrollbar, Select } from '../../../ui';
import { DesignItem } from '../molecules/designItem';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { mapDesignMenuToProps, mapDesignMenuDispatch } from '../selectors';

const DesignMenuWrapper = styled.div`
  width: 240px;
  height: 100%;
  opacity: 0.95;
  background-color: #eaeaea;
  right: ${({ visible }) => visible ? '43px' : '-240px'};
  top: 0;
  bottom: 0;
  position: fixed;
  transition: right .3s;
  z-index: 5;
`

const DesignMenuHeader = styled.div`
  height: 58px;
  padding: 15px;
  border-bottom: 1px solid #d8d8d8;
`

const DesignMenuBody = styled.div`
  height: calc(100% - 58px);
  overflow: hidden;
`

// const enchance = compose(
//   // connect(mapDesignMenuToProps, mapDesignMenuDispatch)
// )

const enchance = compose(
  connect(mapDesignMenuToProps, mapDesignMenuDispatch),
  lifecycle({
    componentDidMount() {
      const { getDesigns } = this.props;

      getDesigns();
    }
  })
)

export const DesignMenu = enchance(({ items = [], visible, categories = [], category, setCategory, handleClick }) => (
  <DesignMenuWrapper visible={visible}>
    <DesignMenuHeader>
      <Select
        onChange={setCategory}
        options={categories}
        initialValue={category} />
    </DesignMenuHeader>
    <DesignMenuBody>
      <Scrollbar>
        {items.map(({ preview, id, caption, loading }) => (
          <DesignItem
            key={id}
            image={preview}
            onClick={(event) => handleClick({ desigId: id, event: event })}
            title={caption}
            loading={loading} />
        ))}
      </Scrollbar>
    </DesignMenuBody>
  </DesignMenuWrapper>
))
