const addComission = (amount, comission) => {
  return amount * (1 + comission);
}

const substractComission = (amount, comission) => {
  return amount * (1 - comission);
}

const calculateMidPrice = (bid, ask) => {
  return (bid + ask) / 2;
}

module.exports = {
  addComission,
  substractComission,
  calculateMidPrice,
};
