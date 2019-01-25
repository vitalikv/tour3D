export const getRelativeValue = (value, max) => {
  return (1 / (max / value))
}

export const getAbsoluteValue = (value, max) => {
  return max * value
}
