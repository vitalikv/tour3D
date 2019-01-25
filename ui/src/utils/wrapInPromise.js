export function wrapInPromise(func) {
  return new Promise((resolve) => {
    func((response) => resolve(response))
  })
}
