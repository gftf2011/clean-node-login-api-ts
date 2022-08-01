import {
  badRequest,
  created,
  forbidden,
  ok,
  serverError,
  unauthorized,
} from '../../../../src/presentation/helpers/http-helper';

describe('Http Helpers', () => {
  describe('ok', () => {
    it('should return 200 status code', () => {
      const data = {};

      const sut = ok(data);

      expect(sut.statusCode).toBe(200);
      expect(sut.body).toEqual(data);
    });
  });

  describe('created', () => {
    it('should return 201 status code', () => {
      const data = {};

      const sut = created(data);

      expect(sut.statusCode).toBe(201);
      expect(sut.body).toEqual(data);
    });
  });

  describe('badRequest', () => {
    it('should return 400 status code', () => {
      const error = new Error();

      const sut = badRequest(error);

      expect(sut.statusCode).toBe(400);
      expect(sut.body).toBeInstanceOf(Error);
      expect(sut.body).toEqual(error);
    });
  });

  describe('unauthorized', () => {
    it('should return 401 status code', () => {
      const error = new Error();

      const sut = unauthorized(error);

      expect(sut.statusCode).toBe(401);
      expect(sut.body).toBeInstanceOf(Error);
      expect(sut.body).toEqual(error);
    });
  });

  describe('forbidden', () => {
    it('should return 403 status code', () => {
      const error = new Error();

      const sut = forbidden(error);

      expect(sut.statusCode).toBe(403);
      expect(sut.body).toBeInstanceOf(Error);
      expect(sut.body).toEqual(error);
    });
  });

  describe('serverError', () => {
    it('should return 500 status code', () => {
      const error = new Error();

      const sut = serverError(error);

      expect(sut.statusCode).toBe(500);
      expect(sut.body).toBeInstanceOf(Error);
      expect(sut.body).toEqual(error);
    });
  });
});
