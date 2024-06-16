const axios = require('axios');
const config = require('../config/env');
const { throwError } = require('../utils/errors');

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

const getAggregated = async (props) => {
  const { symbol, multiply, time, from, to, limit } = props;

  const apiUrl = `agg/forex/${symbol}/${multiply}/${time}/${from}/${to}`;
  const params = { apikey: config.dataProvider.apiKey };

  if (limit) {
    params.limit = limit;
  }

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

module.exports = {
  getSymbolList,
  getAggregated,
};
