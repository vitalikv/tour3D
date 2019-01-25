import { compose, withHandlers, lifecycle } from 'recompose';

export const withMouseMove = compose(
  withHandlers(() => {
    return {
      onClick: ({ handleMouseClick, handleMouseMove }) => (event) => {
        if (typeof handleMouseClick === 'function') {
          handleMouseClick(event);
        }
        if (typeof handleMouseMove === 'function') {
          handleMouseMove(event);
        }
      },
      mouseMove: ({ handleMouseMove }) => (event) => {
        if (typeof handleMouseMove === 'function') {
          handleMouseMove(event);
        }
      },
    }
  }),
  lifecycle({
    componentDidMount() {
      const { mouseMove } = this.props;
      const { onClick } = this.props;

      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('click', onClick);
    },
    componentWillUnmount() {
      const { mouseMove } = this.props;
      const { onClick } = this.props;
      
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('click', onClick);
    }
  })
);
