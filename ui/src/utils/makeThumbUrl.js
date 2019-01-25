export function makeThumbUrl(url, size) {
  var parsedUrl = url.match(/(.*thumb)(\d+)?(x)(\d+)?(.*)/i);
  if (!parsedUrl) return url;
  return parsedUrl[1] + size + parsedUrl[5];
}
