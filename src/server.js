const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const httpPort = parseInt(process.env.PORT);
const priceCacheTimeout = parseInt(process.env.UPDATE_FREQUENCY);
const serviceCommission = parseFloat(process.env.SERVICE_COMMISSION);
const binanceApiUrl = process.env.BINANCE_API_URL;
const exchangeSymbol = process.env.EXCHANGE_SYMBOL;

let lastPriceTime = null;
let lastBidPrice = null;
let lastAskPrice = null;

const addComission = (amount, comission) => {
  return amount * (1 + comission);
}

const substractComission = (amount, comission) => {
  return amount * (1 - comission);
}

const getBinancePrice = async () => {
  const response = await axios.get(`${binanceApiUrl}/ticker/bookTicker?symbol=${exchangeSymbol}`);
  const bidPrice = parseFloat(response.data.bidPrice);
  const askPrice = parseFloat(response.data.askPrice);

  return {
    bidPrice,
    askPrice,
  };
};

const getCachedPrice = async () => {
  const now = Date.now();

  if (lastPriceTime === null || now - lastPriceTime > priceCacheTimeout) {
    const { bidPrice, askPrice } = await getBinancePrice();

    lastBidPrice = addComission(bidPrice, serviceCommission);
    lastAskPrice = substractComission(askPrice, serviceCommission);
    lastPriceTime = now;
  }

  return {
    bidPrice: lastBidPrice,
    askPrice: lastAskPrice
  };
};

app.get('/', async (req, res) => {
  const { bidPrice, askPrice } = await getCachedPrice();
  const midPrice = (bidPrice + askPrice) / 2;

  res.json({
    bid: bidPrice.toFixed(2),
    ask: askPrice.toFixed(2),
    mid: midPrice.toFixed(2),
  });
});

app.listen(httpPort, () => {
  console.log(`Bitcoin price microservice is listening on port ${httpPort}...`);
});
