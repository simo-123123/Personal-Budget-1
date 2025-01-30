// Rounds down a number to the second decimal place
const roundToDecimal = number => Math.round(number * 100) / 100;

module.exports = roundToDecimal;