import { API } from './api';

export const UIInvokeFunction = (name, payload) => {
  API.dispatchAction(name, payload)
}
