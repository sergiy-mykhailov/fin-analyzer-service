const { AxiosError, HttpStatusCode } = require('axios');
const { Boom } = require('@hapi/boom');
const { DBError, ValidationError } = require('objection');
const get = require('lodash/get');
const invert = require('lodash/invert');

const DEFAULT_STATUS =  HttpStatusCode.InternalServerError;
const DEFAULT_MESSAGE = 'Something went wrong :(';
const DEFAULT_ERROR_NAME = 'Error';

const statusCodeToMessage = invert(HttpStatusCode);

const dbErrorNameToStatusCode = {
  DBError: HttpStatusCode.UnprocessableEntity,
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
  data,
) => {
  if (error.isBoom) {
    error.output.statusCode = statusCode;
    error.reformat();
    error.output.payload.statusCode = statusCode;
    error.output.payload.error = errorName;
    error.output.payload.message = message;
    if (data) {
      error.output.payload.data = data;
    }
  } else {
    Boom.boomify(error, { statusCode, message, error: errorName, data });
  }

  return error;
};

const reformatAxiosError = (error) => {
  const statusCode = get(error, 'response.status');
  const errorName = get(error, 'response.statusText', 'AxiosError');
  const message = get(error, 'response.data.error') || errorName || get(statusCodeToMessage, statusCode);

  return reformatError(error, statusCode, message, errorName);
};

const reformatDBError = (error) => {
  const errorName = get(error, 'name', 'DBError');
  const statusCode = get(dbErrorNameToStatusCode, errorName, HttpStatusCode.InternalServerError);
  const message = get(error, 'nativeError.detail') || get(error, 'message');

  return reformatError(error, statusCode, message, errorName);
};

const reformatValidationError = (error) => {
  const errorName = get(error, 'name', 'ValidationError');
  const statusCode = get(error, 'statusCode', HttpStatusCode.InternalServerError);
  const message = get(error, 'message');
  const data = get(error, 'data');

  return reformatError(error, statusCode, message, errorName, data);
};

const preResponse = (request, h) => {
  const response = request.response;

  if (response.isAxiosError || response instanceof AxiosError) {
    return reformatAxiosError(response);
  }

  if (response instanceof DBError) {
    return reformatDBError(response);
  }

  if (response instanceof ValidationError) {
    return reformatValidationError(response);
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
