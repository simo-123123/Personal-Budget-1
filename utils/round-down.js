// Rounds down a number to the second decimal place
const roundDown = number => Math.floor(number * 100) / 100;

module.exports = roundDown;