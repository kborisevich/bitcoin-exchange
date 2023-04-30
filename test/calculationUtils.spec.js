const { assert } = require('chai');
const { addComission, substractComission, calculateMidPrice } = require('../src/calculationUtils');

describe('addComission', () => {
  it('should add 0% comission to zero amount correctly', () => {
    const result = addComission(0, 0);
    assert.equal(result, 0);
  });

  it('should add comission to negative amount correctly', () => {
    const result = addComission(-100, 0.1);
    assert.equal(result, -110);
  });

  it('should add 20% comission correctly', () => {
    const result = addComission(200, 0.2);
    assert.equal(result, 240);
  });

  it('should add 5% comission correctly to decimal amount', () => {
    const result = addComission(14.5, 0.05, 3);
    assert.equal(result, 15.225);
  });
});

describe('substractComission', () => {
  it('should substract 0% comission to zero amount correctly', () => {
    const result = substractComission(0, 0);
    assert.equal(result, 0);
  });

  it('should substract comission from negative amount correctly', () => {
    const result = substractComission(-100, 0.1);
    assert.equal(result, -90);
  });

  it('should substract 20% comission correctly', () => {
    const result = substractComission(200, 0.2);
    assert.equal(result, 160);
  });

  it('should substract 5% comission correctly to decimal amount', () => {
    const result = substractComission(14.5, 0.05, 3);
    assert.equal(result, 13.775);
  });
});

describe('calculateMidPrice', () => {
  it('should calculate mid price correctly with decimal numbers', () => {
    const result = calculateMidPrice(12.75, 15.5, 3);
    assert.equal(result, 14.125);
  });

  it('should calculate mid price correctly with integer numbers', () => {
    const result = calculateMidPrice(12, 15);
    assert.equal(result, 13.5);
  });

  it('should calculate mid price correctly with zero bid and ask', () => {
    const result = calculateMidPrice(0, 0);
    assert.equal(result, 0);
  });

  it('should calculate mid price correctly with same bid and ask', () => {
    const result = calculateMidPrice(15, 15);
    assert.equal(result, 15);
  });
});
