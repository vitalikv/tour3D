import React from 'react';
import styled from 'styled-components';
import ReactDOM from 'react-dom'
import { withStateHandlers, compose, mapProps, } from 'recompose';
import { withMouseMove } from '../../../hoc';
import { makeThumbUrl } from '../../../utils';

let modalRoot = document.getElementById('modalRoot');

class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.el = document.createElement('div');
  }

  componentDidMount() {
    if (!modalRoot) {
      let modalRoot = document.createElement('div');
      modalRoot.id = 'modalRoot';
      document.body.appendChild(modalRoot);
    }
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

const Preview = styled.div.attrs(
  ({ x, y }) => ({
    style: {
      left: `${x}px`,
      top: `${y}px`
    }
  }))`
  width: 54px;
  height: 54px;
  background-image: ${({ preview }) => `url(${makeThumbUrl(preview, '54x54')})`};
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  position: fixed;
  pointer-events: none;
`;

const withModal = (Component) => ({ preview, x, y, offsetX, offsetY, ...restProps }) => {
  const root = document.getElementById('modalRoot');

  if (preview) {
    root.style.position = 'fixed';
    root.style.width = '100%';
    root.style.height = '100%';
    return (
      <Modal>
        <Component
          x={x + offsetX}
          y={y + offsetY}
          preview={preview}
          {...restProps} />
      </Modal>
    )
  } else {
    root.style = {};
  }

  return null;
}

const withMousePosition = compose(
  withStateHandlers({
    offsetX: 7,
    offsetY: 20,
    x: null,
    y: null,
  }, {
      handleMouseMove: (state, { preview }) => ({ clientX, clientY }) => {
        if (preview) {
          return {
            x: clientX,
            y: clientY
          }
        }
      },
      handleMouseClick: (state, { hidePreview, preview }) => (event) => {
        if (typeof hidePreview === 'function') {
          hidePreview(event);
        }

        return {
          x: null,
          y: null,
        }
      }
    }),
  mapProps(({ x, y, initialX = 0, initialY = 0, ...restProps }) => {

    return {
      x: x === null ? initialX : x,
      y: y === null ? initialY : y,
      ...restProps,
    }
  })
)

const withCursorPositon = compose(
  withMousePosition,
  withModal,
  withMouseMove,
)

export const CursorPreview = withCursorPositon(Preview)
