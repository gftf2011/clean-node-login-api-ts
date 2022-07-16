/**
 * Driver
 */
import { cpf } from 'cpf-cnpj-validator';
import faker from 'faker';

/**
 * Entities
 */
// eslint-disable-next-line sort-imports
import {
  EmailEntity,
  LastnameEntity,
  NameEntity,
  PasswordEntity,
  TaxvatEntity,
} from '../../../../../src/entities';
import { EntityFactory } from '../../../../../src/entities/helpers/factory-methods';

describe('Entity Factory', () => {
  const generateValidEmail = (): string => {
    return faker.internet.email();
  };

  const generateValidLastname = (): string => {
    return faker.lorem.word(2);
  };

  const generateValidName = (): string => {
    return faker.lorem.word(2);
  };

  const generateValidPassword = (): string => {
    const specialSymbols = '!@#$%&?';
    /**
     * Code below will pick one of the special characters to be put in the password
     */
    const chosenSpecialSymbol = specialSymbols.charAt(
      Math.round((specialSymbols.length - 1) * Math.random()),
    );
    return `${faker.datatype.number({
      min: 10000000,
      max: 99999999,
    })}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toLowerCase()}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toUpperCase()}${chosenSpecialSymbol}`;
  };

  const generateValidTaxvat = (formatted?: boolean): string => {
    return cpf.generate(formatted);
  };

  it('should create Email Entity', () => {
    const value = generateValidEmail();
    const emailEntity = EntityFactory.create(EmailEntity.name, value);
    expect(emailEntity).toEqual(EmailEntity.create(value));
  });

  it('should create Name Entity', () => {
    const value = generateValidName();
    const nameEntity = EntityFactory.create(NameEntity.name, value);
    expect(nameEntity).toEqual(NameEntity.create(value));
  });

  it('should create Lastname Entity', () => {
    const value = generateValidLastname();
    const lastnameEntity = EntityFactory.create(LastnameEntity.name, value);
    expect(lastnameEntity).toEqual(LastnameEntity.create(value));
  });

  it('should create Taxvat Entity', () => {
    const value = generateValidTaxvat();
    const taxvatEntity = EntityFactory.create(TaxvatEntity.name, value);
    expect(taxvatEntity).toEqual(TaxvatEntity.create(value));
  });

  it('should create Password Entity', () => {
    const value = generateValidPassword();
    const passwordEntity = EntityFactory.create(PasswordEntity.name, value);
    expect(passwordEntity).toEqual(PasswordEntity.create(value));
  });

  it('should create Email Entity by default', () => {
    const value = generateValidEmail();
    const emailEntity = EntityFactory.create('', value);
    expect(emailEntity).toEqual(EmailEntity.create(value));
  });
});
