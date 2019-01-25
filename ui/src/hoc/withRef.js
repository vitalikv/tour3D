import { withHandlers } from 'recompose';

export const withRef = withHandlers(() => {
  let myRef = null;
  return {
    withRef: () => (ref) => (myRef = ref),
    getRef: () => () => myRef
  }
});
