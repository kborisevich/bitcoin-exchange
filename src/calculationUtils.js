const addComission = (amount, comission, precision = 2) => {
  const amountWithComission = amount * (1 + comission);

  return parseFloat(amountWithComission.toFixed(precision));
}

const substractComission = (amount, comission, precision = 2) => {
  const amountWithoutComission = amount * (1 - comission);

  return parseFloat(amountWithoutComission.toFixed(precision));
}

const calculateMidPrice = (bid, ask, precision = 2) => {
  const midPrice = (bid + ask) / 2;

  return parseFloat(midPrice.toFixed(precision));
}

module.exports = {
  addComission,
  substractComission,
  calculateMidPrice,
};
