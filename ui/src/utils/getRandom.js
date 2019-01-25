export const getRandom = (min, max) => (
  Math.random() * (max - min) + min
);

export const getOneOf = (first, second) => (
  getRandom(0, 1) > 0.5 ? first : second
)
