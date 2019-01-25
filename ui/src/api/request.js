import { createFormData } from '../utils';

const hostname = window.location.hostname === 'localhost' ? 'pp.ksdev.ru' : window.location.hostname;

export const request = {
  get: async (url) => {
    return await fetchRequest({ url })
  },
  post: async (url, data) => {
    return await fetchRequest({
      url,
      method: 'POST',
      data,
    })
  },
  authRequest: async (data) => {
    return await fetchRequest({
      url: 'https://' + hostname + '/ru/login/',
      method: 'POST',
      data,
      useHeaders: true,
    })
  },
  regRequest: async (data) => {
    return await fetchRequest({
      url: 'https://' + hostname + '/ru/auth/register/',
      method: 'POST',
      data,
      useHeaders: true,
    })
  },
  vkAuthRequest: async (data) => {
    return await fetchRequest({
      url: 'https://' + hostname + '/auth/vkontakte/',
      method: 'POST',
      useHeaders: true,
    })
  },
  fbAuthRequest: async (data) => {
    return await fetchRequest({
      url: 'https://' + hostname + '/auth/facebook/',
      method: 'POST',
      useHeaders: true,
    })
  },
}

const fetchRequest = async ({ url, method = 'GET', data, useHeaders }) => {

  const params = {
    method,
  }

  if (useHeaders) {
    const headers = new Headers();

    headers.append('X-Requested-With', 'XMLHttpRequest');
    params.headers = headers;
  }

  if (data) {
    params.body = createFormData(data);
  }

  const response = await fetch(url, params);
  const responseData = await response.json();

  return responseData;
}
