import axios from 'axios';

export default function apiRequest(path, keys, params) {
  params.keys = [];
  params.keys.push(...keys);
  params.lang = 'ru';
  // params.test = 1;  

  const options = {
    method: 'GET',
    url: path,
    // baseURL: 'https://catalog.pp.ksdev.ru/',
    baseURL: 'https://catalog.planoplan.com/',
    params: params,
    responseType: 'json'
  }
  return axios(options)
}