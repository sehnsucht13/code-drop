// Check if a string is a valid integer.
const isInt = (num) =>
  !Number.isNaN(num) && parseInt(+num, 10) === +num && +num >= 0;

module.exports = {
  isInt,
};
