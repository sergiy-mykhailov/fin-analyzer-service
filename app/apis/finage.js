const axios = require('axios');
const config = require('../constants/env');
const { throwError } = require('../utils/errors');

const DEFAULT_TIME_MULTIPLIER = 1;
const SIZE_OF_TIME = {
  MINUTE: 'minute',
  HOUR: 'hour',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
};

const headers = {
  'Content-Type': 'application/json',
};

const getSymbolList = async (marketType, page, search) => {
  const apiUrl = `symbol-list/${marketType}`;

  const params = {
    apikey: config.dataProvider.apiKey,
  };

  if (page) {
    params.page = page;
  }
  if (search) {
    params.page = search;
  }

  const response = await axios.get(apiUrl, {
    baseURL: config.dataProvider.baseUrl,
    headers,
    params,
  });

  if (response.status !== 200 || !response.data) {
    throwError('Error receiving instruments list', response.status, response.statusText);
  }

  return response.data;
};

const getAggregates = async (props) => {
  const { symbol, from, to, st, et, limit } = props;

  const apiUrl = `agg/forex/${symbol}/${DEFAULT_TIME_MULTIPLIER}/${SIZE_OF_TIME.MINUTE}/${from}/${to}`;
  const params = {
    apikey: config.dataProvider.apiKey,
    sort: 'desc',
    ...(limit ? { limit } : {}),
    ...(st ? { st } : {}),
    ...(et ? { et } : {}),
  };

  const response = await axios.get(apiUrl, {
    baseURL: config.dataProvider.baseUrl,
    headers,
    params,
  });

  if (response.status !== 200 || !response.data) {
    throwError('Error receiving aggregated data', response.status, response.statusText);
  }

  return response.data;
};

const getTicks = async (props) => {
  const { symbol, date, limit } = props;

  const apiUrl = `history/ticks/forex/${symbol}/${date}`;
  const params = {
    apikey: config.dataProvider.apiKey,
    ...(limit ? { limit } : {}),
  };

  const response = await axios.get(apiUrl, {
    baseURL: config.dataProvider.baseUrl,
    headers,
    params,
  });

  if (response.status !== 200 || !response.data) {
    throwError('Error receiving tick data', response.status, response.statusText);
  }

  return response.data;
};

module.exports = {
  getSymbolList,
  getAggregates,
  getTicks,
};
