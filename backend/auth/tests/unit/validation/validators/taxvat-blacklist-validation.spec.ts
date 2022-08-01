/**
 * Driver
 */
import { cpf } from 'cpf-cnpj-validator';

/**
 * Validation
 */
// eslint-disable-next-line sort-imports
import { TaxvatBlacklistValidation } from '../../../../src/validation/validators';

/**
 * Stubs
 */
// eslint-disable-next-line sort-imports
import {
  InvalidTaxvatInBlacklistValidatorAdapterStub,
  NoTaxvatInBlacklistValidatorAdapterStub,
} from '../../doubles/stubs';

/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import { InvalidParamError } from '../../../../src/shared/errors';

enum VALIDATOR_TYPE {
  STUB_TAXVAT_IN_BLACKLIST = 'STUB_TAXVAT_IN_BLACKLIST',
  STUB_TAXVAT_NOT_IN_BLACKLIST = 'STUB_TAXVAT_NOT_IN_BLACKLIST',
}

const makeValidator = (type: VALIDATOR_TYPE): any => {
  switch (type) {
    case VALIDATOR_TYPE.STUB_TAXVAT_IN_BLACKLIST:
      return new InvalidTaxvatInBlacklistValidatorAdapterStub();
    case VALIDATOR_TYPE.STUB_TAXVAT_NOT_IN_BLACKLIST:
      return new NoTaxvatInBlacklistValidatorAdapterStub();
    default:
      return new InvalidTaxvatInBlacklistValidatorAdapterStub();
  }
};

const makeSut = (validatorType: VALIDATOR_TYPE, taxvat: string): any => {
  const doubleValidator = makeValidator(validatorType);

  const sut = new TaxvatBlacklistValidation(taxvat, doubleValidator);

  return sut;
};

describe('Taxvat Blacklist Validation', () => {
  it('should return invalid param error if taxvat belongs to blacklist', async () => {
    const taxvat = cpf.generate();
    const sut = makeSut(VALIDATOR_TYPE.STUB_TAXVAT_IN_BLACKLIST, taxvat);
    const promise = sut.validate();
    await expect(promise).rejects.toThrow(new InvalidParamError(taxvat));
  });

  it('should return nothing if taxvat does not belongs to blacklist', async () => {
    const taxvat = cpf.generate();
    const sut = makeSut(VALIDATOR_TYPE.STUB_TAXVAT_NOT_IN_BLACKLIST, taxvat);
    const promise = sut.validate();
    await expect(promise).resolves.toBeUndefined();
  });
});
