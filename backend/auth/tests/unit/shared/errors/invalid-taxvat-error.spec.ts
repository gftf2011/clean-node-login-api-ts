/**
 * Driver
 */
import { cpf } from 'cpf-cnpj-validator';

/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import { Error400, InvalidTaxvatError } from '../../../../src/shared/errors';

describe('Invalid Taxvat Error', () => {
  let sut: InvalidTaxvatError;
  let taxvat: string;

  beforeEach(() => {
    taxvat = cpf.generate();
    sut = new InvalidTaxvatError(taxvat);
  });

  it('should extend Error400', () => {
    expect(sut).toBeInstanceOf(Error400);
  });

  it('should return error message', () => {
    expect(sut.message).toBe(`The taxvat '${taxvat}' is not valid`);
  });

  it('should return error name', () => {
    expect(sut.name).toBe('InvalidTaxvatError');
  });
});
