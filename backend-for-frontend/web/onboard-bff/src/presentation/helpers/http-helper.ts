import { HttpResponse } from '../ports';

/**
 * @desc the 'ok' method indicating success in retrieve the data
 * @param {any} data - data already transformed by the controllers and use cases
 * @returns {HttpResponse} response that has the statusCode 200 and data body
 * @example
 * returns {
 *  statusCode: 200,
 *  body: {}
 * }
 * ok({});
 */
export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

/**
 * @desc the 'create' method indicating success in retrieve the data
 * @param {any} data - data already transformed by the controllers and use cases
 * @returns {HttpResponse} response that has the statusCode and data body
 * @example
 * returns {
 *  statusCode: 201,
 *  body: {}
 * }
 * created({});
 */
export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data,
});

/**
 * @desc the 'unauthorized' method indicates that it was not possible identify the request user
 * @param {Error} error - error thrown by the application
 * @returns {HttpResponse} response that has the statusCode and error body
 * @example
 * returns {
 *  statusCode: 401,
 *  body: new Error()
 * }
 * unauthorized(new Error());
 */
export const unauthorized = (error: Error): HttpResponse => ({
  statusCode: 401,
  body: error,
});

/**
 * @desc the 'forbidden' method indicates that the user was identified but it does not have the access permission
 * @param {Error} error - error thrown by the application
 * @returns {HttpResponse} response that has the statusCode and error body
 * @example
 * returns {
 *  statusCode: 403,
 *  body: new Error()
 * }
 * forbidden(new Error());
 */
export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error,
});

/**
 * @desc the 'badRequest' method indicates the server could not process the request because of client error
 * @param {Error} error - error thrown by the application
 * @returns {HttpResponse} response that has the statusCode and error body
 * @example
 * returns {
 *  statusCode: 400,
 *  body: new Error()
 * }
 * badRequest(new Error());
 */
export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

/**
 * @desc the 'serverError' method indicates the server could not process the request because of unexpected error
 * @param {Error} error - error thrown by the application
 * @returns {HttpResponse} response that has the statusCode and error body
 * @example
 * returns {
 *  statusCode: 500,
 *  body: new Error()
 * }
 * serverError(new Error());
 */
export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: error,
});
