// Check if a string is a valid integer.
const isInt = (num) => {
  return !isNaN(num) && parseInt(+num) === +num;
};

module.exports = {
  isInt,
};
