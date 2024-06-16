const { AxiosError, HttpStatusCode } = require('axios');
const { Boom } = require('@hapi/boom');
const get = require('lodash/get');
const invert = require('lodash/invert');

const statusCodeToMessage = invert(HttpStatusCode);

const reformatAxiosError = (error) => {
  const statusCode = get(error, 'response.status', HttpStatusCode.InternalServerError);
  const statusText = get(error, 'response.statusText', 'AxiosError');
  const message = get(error, 'response.status.data.error') || statusText || get(statusCodeToMessage, statusCode) || 'Something went wrong :(';


  if (error.isBoom) {
    error.output.statusCode = statusCode;
    error.reformat();
    error.output.payload.statusCode = statusCode;
    error.output.payload.error = statusText;
    error.output.payload.message = message;
  } else {
    Boom.boomify(error, { statusCode, message, error: statusText });
  }

  return error;
};

const preResponse = (request, h) => {
  const response = request.response;

  if (response.isAxiosError || response instanceof AxiosError) {
    return reformatAxiosError(response);
  }

  return h.continue;
};

const throwError = (message, statusCode, data) => {
  throw new Boom.Boom(message, { statusCode, data });
};

module.exports = {
  preResponse,
  throwError,
};
