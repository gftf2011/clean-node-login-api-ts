/**
 * Driver
 */
import { cpf } from 'cpf-cnpj-validator';
import faker from 'faker';

/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import { InvalidTaxvatError } from '../../../src/shared/errors';

/**
 * Entities
 */
import { TaxvatEntity } from '../../../src/entities';

/**
 * Shared
 */
import { left } from '../../../src/shared';

describe('Taxvat Entity', () => {
  const generateValidTaxvat = (formatted?: boolean): string => {
    return cpf.generate(formatted);
  };

  const clearTaxvat = (taxvat: string): string => {
    return taxvat.replace(/[\\.-]*/g, '').trim();
  };

  const formatTaxvat = (taxvat: string): string => {
    const cleanTaxvat = taxvat.replace(/[\\.-]*/g, '').trim();
    return cleanTaxvat.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  };

  const generateBlacklistedTaxvat = (): string => {
    const taxvatBlacklist = [
      '00000000000',
      '11111111111',
      '22222222222',
      '33333333333',
      '44444444444',
      '55555555555',
      '66666666666',
      '77777777777',
      '88888888888',
      '99999999999',
    ];
    return taxvatBlacklist[
      Math.round((taxvatBlacklist.length - 1) * Math.random())
    ];
  };

  const generateInvalidFirstDigitTaxvat = (formatted?: boolean): string => {
    const cpfGenerated = cpf.generate();
    const secondValidationDigit = cpfGenerated.substring(
      cpfGenerated.length - 1,
      cpfGenerated.length,
    );
    const firstValidationDigit = cpfGenerated.substring(
      cpfGenerated.length - 2,
      cpfGenerated.length - 1,
    );

    const invalidFirstValidationDigit =
      +firstValidationDigit >= 9
        ? +firstValidationDigit - 1
        : +firstValidationDigit + 1;

    const invalidTaxvat =
      cpfGenerated.substring(0, cpfGenerated.length - 2) +
      invalidFirstValidationDigit +
      secondValidationDigit;

    return formatted
      ? `${invalidTaxvat.substring(0, 3)}.${invalidTaxvat.substring(
          3,
          6,
        )}.${invalidTaxvat.substring(6, 9)}-${invalidTaxvat.substring(9, 11)}`
      : invalidTaxvat;
  };

  const generateInvalidSecondDigitTaxvat = (formatted?: boolean): string => {
    const cpfGenerated = cpf.generate();
    const firstValidationDigit = cpfGenerated.substring(
      cpfGenerated.length - 2,
      cpfGenerated.length - 1,
    );
    const secondValidationDigit = cpfGenerated.substring(
      cpfGenerated.length - 1,
      cpfGenerated.length,
    );

    const invalidSecondValidationDigit =
      +secondValidationDigit >= 9
        ? +secondValidationDigit - 1
        : +secondValidationDigit + 1;

    const invalidTaxvat =
      cpfGenerated.substring(0, cpfGenerated.length - 2) +
      firstValidationDigit +
      invalidSecondValidationDigit;

    return formatted
      ? `${invalidTaxvat.substring(0, 3)}.${invalidTaxvat.substring(
          3,
          6,
        )}.${invalidTaxvat.substring(6, 9)}-${invalidTaxvat.substring(9, 11)}`
      : invalidTaxvat;
  };

  it('should not create taxvat if "value" property is undefined', () => {
    const taxvat: any = undefined;
    const taxvatOrError = TaxvatEntity.create(taxvat);
    expect(taxvatOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should not create taxvat if "value" property is null', () => {
    const taxvat: any = null;
    const taxvatOrError = TaxvatEntity.create(taxvat);
    expect(taxvatOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should not create taxvat if "value" property is empty', () => {
    const taxvat = '';
    const taxvatOrError = TaxvatEntity.create(taxvat);
    expect(taxvatOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should not create taxvat if "value" does not have correct length', () => {
    const taxvat = `${faker.datatype.number({ min: 1, max: 10 })}`;
    const taxvatOrError = TaxvatEntity.create(taxvat);
    expect(taxvatOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should not create taxvat if "value" belongs to blacklist', () => {
    const taxvat = generateBlacklistedTaxvat();
    const taxvatOrError = TaxvatEntity.create(taxvat);
    expect(taxvatOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should not create taxvat if "value" first validation digit is invalid', () => {
    const taxvat = generateInvalidFirstDigitTaxvat();
    const taxvatOrError = TaxvatEntity.create(taxvat);
    expect(taxvatOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should not create taxvat if "value" first validation digit is invalid - (even formatted)', () => {
    const taxvat = generateInvalidFirstDigitTaxvat(true);
    const taxvatOrError = TaxvatEntity.create(taxvat);
    expect(taxvatOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should not create taxvart if "value" second validation digit is invalid', () => {
    const taxvat = generateInvalidSecondDigitTaxvat();
    const taxvatOrError = TaxvatEntity.create(taxvat);
    expect(taxvatOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should not create taxvat if "value" second validation digit is invalid - (even formatted)', () => {
    const taxvat = generateInvalidSecondDigitTaxvat(true);
    const taxvatOrError = TaxvatEntity.create(taxvat);
    expect(taxvatOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should not create taxvat if "value" if property has letters', () => {
    const taxvat = faker.lorem.word(11);
    const taxvatOrError = TaxvatEntity.create(taxvat);
    expect(taxvatOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should create taxvat with correct parameters', () => {
    const taxvat = generateValidTaxvat();
    const taxvatOrError = TaxvatEntity.create(taxvat);

    const taxvatEntity = taxvatOrError.value as TaxvatEntity;

    expect(taxvatEntity.getTaxvat()).toBe(taxvat);
    expect(taxvatEntity.getFormattedTaxvat()).toBe(formatTaxvat(taxvat));
  });

  it('should create taxvat with correct parameters - (even with value formatted)', () => {
    const taxvat = generateValidTaxvat(true);
    const taxvatOrError = TaxvatEntity.create(taxvat);

    const taxvatEntity = taxvatOrError.value as TaxvatEntity;

    expect(taxvatEntity.getTaxvat()).toBe(clearTaxvat(taxvat));
    expect(taxvatEntity.getFormattedTaxvat()).toBe(taxvat);
  });
});
