/**
 * Driver
 */
import { cpf } from 'cpf-cnpj-validator';

/**
 * Fakes
 */
// eslint-disable-next-line sort-imports
import { FakeInMemoryListBlacklistTaxvatDao } from '../../../../doubles/fakes/infra';

/**
 * Infra
 */
import { TaxvatBlacklistValidatorAdapter } from '../../../../../../src/infra/validators';

describe('Taxvat Blacklist Validator Adapter', () => {
  it('should return taxvat is valid if it is not in blacklist', async () => {
    const taxvat = cpf.generate();
    const fake = new FakeInMemoryListBlacklistTaxvatDao();
    const sut = new TaxvatBlacklistValidatorAdapter(fake);

    const response = await sut.isValid(taxvat);

    expect(response).toBeTruthy();
  });

  it('should return taxvat is not valid if it is in blacklist', async () => {
    const taxvat = cpf.generate();
    const fake = new FakeInMemoryListBlacklistTaxvatDao([taxvat]);
    const sut = new TaxvatBlacklistValidatorAdapter(fake);

    const response = await sut.isValid(taxvat);

    expect(response).toBeFalsy();
  });
});
