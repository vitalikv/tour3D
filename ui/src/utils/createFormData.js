export function createFormData(data) {
  const formData = new FormData();

  for (let i in data) {
    if (typeof data[i] === 'object') {
      formData.append(i, data[i][0], data[i][1]);
    } else {
      formData.append(i, data[i]);
    }
  }

  return formData
}
