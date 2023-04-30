const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

const calculationUtils = require('./calculationUtils');

dotenv.config();

const app = express();

const httpPort = parseInt(process.env.PORT);
const priceCacheTimeout = parseInt(process.env.UPDATE_FREQUENCY);
const serviceCommission = parseFloat(process.env.SERVICE_COMMISSION);
const binanceApiUrl = process.env.BINANCE_API_URL;
const exchangeSymbol = process.env.EXCHANGE_SYMBOL;

const cachedQuote = {
  bidPrice: null,
  askPrice: null,
  midPrice: null,
  quoteTime: null,
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

const setCache = (bidPrice, askPrice, now) => {
  cachedQuote.bidPrice = calculationUtils.addComission(bidPrice, serviceCommission);
  cachedQuote.askPrice = calculationUtils.substractComission(askPrice, serviceCommission);
  cachedQuote.midPrice = calculationUtils.calculateMidPrice(cachedQuote.bidPrice, cachedQuote.askPrice);
  cachedQuote.quoteTime = now;
}

const getQuote = async () => {
  const now = Date.now();
  const isCacheOutdated = cachedQuote.quoteTime === null || (now - cachedQuote.quoteTime) > priceCacheTimeout;

  if (isCacheOutdated) {
    const { bidPrice, askPrice } = await getBinancePrice();

    setCache(bidPrice, askPrice, now);
  }

  return {
    bidPrice: cachedQuote.bidPrice,
    askPrice: cachedQuote.askPrice,
    midPrice: cachedQuote.midPrice,
  };
};

app.get('/', async (req, res) => {
  const { bidPrice, askPrice, midPrice } = await getQuote();

  res.json({
    bid: bidPrice,
    ask: askPrice,
    mid: midPrice,
  });
});

app.listen(httpPort, () => {
  console.log(`Bitcoin price microservice is listening on port ${httpPort}...`);
});
