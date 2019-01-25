function makeThumbUrl(url, size) {
  if (typeof url !== 'string') return;
  const parsedUrl = url.match(/(.*thumb)(\d+)?(x)(\d+)?(.*)/i);
  
  if (!parsedUrl) return url;
  return parsedUrl[1] + size + parsedUrl[5]
}

export default makeThumbUrl