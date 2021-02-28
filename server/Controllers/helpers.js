// Check if a string is a valid integer.
const isInt = (num) => {
  return !isNaN(num) && parseInt(+num) === +num && +num >= 0;
};

module.exports = {
  isInt,
};
