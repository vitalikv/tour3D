import { compose, withHandlers } from 'recompose';



export const withMouseEvents = compose(
  withHandlers(() => {
    let _mouseDown = false;
    let _mousePressed = null;

    function onDown(handleMouseDown, handleMousePressed, event) {
      _mouseDown = true;

      if (typeof handleMouseDown === 'function') {
        handleMouseDown(event);
      }
      if (typeof handleMousePressed === 'function') {
        _mousePressed = setInterval(handleMousePressed, 25);
      }
    }

    function onMove(handleMouseMove, event) {
      if (_mouseDown && typeof handleMouseMove === 'function') {
        handleMouseMove(event);
      }
    }

    function onUp(handleMouseUp, handleMousePressed, event) {
      if (_mouseDown && typeof handleMouseUp === 'function') {
        handleMouseUp(event);
      }
      _mouseDown = false;

      if (typeof handleMousePressed === 'function') {
        clearInterval(_mousePressed);
      }
    }

    return {
      onMouseMove: ({ handleMouseMove }) => (event) => onMove(handleMouseMove, event),
      onTouchMove: ({ handleMouseMove }) => (event) => onMove(handleMouseMove, event),
      onTouchStart: ({ handleMouseDown, handleMousePressed }) => (event) => onDown(handleMouseDown, handleMousePressed, event),
      onMouseDown: ({ handleMouseDown, handleMousePressed }) => (event) => onDown(handleMouseDown, handleMousePressed, event),
      onTouchEnd: ({ handleMouseUp, handleMousePressed }) => (event) => onUp(handleMouseUp, handleMousePressed, event),
      onMouseUp: ({ handleMouseUp, handleMousePressed }) => (event) => onUp(handleMouseUp, handleMousePressed, event),
      onWheel: ({ handleMouseWheel }) => (event) => {
        if (typeof handleMouseWheel === 'function') {
          handleMouseWheel(event)
        }
      },
    }
  }),
);

