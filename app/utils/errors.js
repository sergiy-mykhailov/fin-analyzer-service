const { AxiosError, HttpStatusCode } = require('axios');
const { Boom } = require('@hapi/boom');
const { DBError } = require('objection');
const get = require('lodash/get');
const invert = require('lodash/invert');

const DEFAULT_STATUS =  HttpStatusCode.InternalServerError;
const DEFAULT_MESSAGE = 'Something went wrong :(';
const DEFAULT_ERROR_NAME = 'Error';

const statusCodeToMessage = invert(HttpStatusCode);

const errorNameToStatusCode = {
  DBError: HttpStatusCode.InternalServerError,
  CheckViolationError: HttpStatusCode.UnprocessableEntity,
  ConstraintViolationError: HttpStatusCode.UnprocessableEntity,
  DataError: HttpStatusCode.UnprocessableEntity,
  ForeignKeyViolationError: HttpStatusCode.UnprocessableEntity,
  NotNullViolationError: HttpStatusCode.UnprocessableEntity,
  UniqueViolationError: HttpStatusCode.Conflict,
};

const reformatError = (
  error,
  statusCode = DEFAULT_STATUS,
  message = DEFAULT_MESSAGE,
  errorName = DEFAULT_ERROR_NAME,
) => {
  if (error.isBoom) {
    error.output.statusCode = statusCode;
    error.reformat();
    error.output.payload.statusCode = statusCode;
    error.output.payload.error = errorName;
    error.output.payload.message = message;
  } else {
    Boom.boomify(error, { statusCode, message, error: errorName });
  }

  return error;
};

const reformatAxiosError = (error) => {
  const statusCode = get(error, 'response.status');
  const errorName = get(error, 'response.statusText', 'AxiosError');
  const message = get(error, 'response.status.data.error') || errorName || get(statusCodeToMessage, statusCode);

  return reformatError(error, statusCode, message, errorName);
};

const reformatDBError = (error) => {
  const errorName = get(error, 'name', 'DBError');
  const statusCode = get(errorNameToStatusCode, errorName, HttpStatusCode.InternalServerError);
  const message = get(error, 'nativeError.detail') || get(error, 'message');

  return reformatError(error, statusCode, message, errorName);
};

const preResponse = (request, h) => {
  const response = request.response;

  if (response.isAxiosError || response instanceof AxiosError) {
    return reformatAxiosError(response);
  }

  if (response instanceof DBError) {
    return reformatDBError(response);
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
