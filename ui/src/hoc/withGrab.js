import React from 'react';
import styled from 'styled-components';
import { compose, withStateHandlers } from 'recompose';
import { withMouseEvents, withRef, componentWithRef } from './'
import ReactDOM from 'react-dom'

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

const Avatar = styled.div.attrs(
  ({ x, y }) => ({
    style: {
      left: `${x}px`,
      top: `${y}px`
    }
  }))`
  position: fixed;
  pointer-events: none;
`;

const withModal = (Component) => ({ children, x, y, offsetLeft, offsetTop, ...restProps }) => (
  <Component {...restProps}>
    {children}
    {restProps.isGrabbing && <Modal>
      <Avatar x={x - offsetLeft} y={y - offsetLeft}>
        <Component {...restProps}>{children}</Component>
      </Avatar>
    </Modal>}
  </Component>
)

export const withGrab = compose(
  withRef,
  componentWithRef,
  withStateHandlers(() => {
    return {
      x: 0,
      y: 0,
      offsetLeft: 0,
      offsetTop: 0,
      isGrabbing: false
    }
  },
    {
      handleMouseDown: (state, { onGrabStart, getRef }) => ({ clientX, clientY }) => {
        if (typeof onGrabStart === 'function') {
          onGrabStart(clientX, clientY);
        }

        const el = getRef();
        const offsetTop = el.clientHeight / 2;
        const offsetLeft = el.clientWidth / 2;

        return {
          x: clientX,
          y: clientY,
          isGrabbing: true,
          offsetLeft: offsetLeft,
          offsetTop: offsetTop
        }
      },
      handleMouseMove: () => ({ clientX, clientY }) => ({ x: clientX, y: clientY }),
      handleMouseUp: ({ x, y }, { onGrabEnd }) => () => {
        if (typeof onGrabEnd === 'function') {
          onGrabEnd(x, y);
        }

        return { isGrabbing: false }
      }
    }
  ),
  withModal,
  withMouseEvents
);
