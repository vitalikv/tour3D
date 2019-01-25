import { compose, lifecycle, withStateHandlers, branch, renderNothing } from 'recompose';

export const withTransition = compose(
  withStateHandlers({
    shoudRender: false,
  }, {
      setRender: () => (value) => ({ shoudRender: value })
    }),
  lifecycle({
    componentDidMount() {
      if (this.props.isMounted) {
        this.props.setRender(true);
      }
    },
    componentDidUpdate(prevProps) {
      if (prevProps.isMounted && !this.props.isMounted) {
        this.props.setRender(false);
      } else if (!prevProps.isMounted && this.props.isMounted) {
        this.props.setRender(true);
      }
    }
  }),
  branch(({ shoudRender }) => !shoudRender, renderNothing),
)
