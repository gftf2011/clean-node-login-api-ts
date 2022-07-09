/**
 * Driver
 */
import { cpf } from 'cpf-cnpj-validator';
import faker from 'faker';

/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import {
  InvalidLastnameError,
  InvalidNameError,
} from '../../../src/shared/errors';

/**
 * Entities
 */
import { UserEntity } from '../../../src/entities';

/**
 * Shared
 */
import { left } from '../../../src/shared';

describe('User Entity', () => {
  it('should not create user if "name" property is undefined', () => {
    const name: string = undefined;
    const lastname = faker.lorem.word(2);
    const taxvat = cpf.generate();
    const email = faker.internet.email();
    const password = `${faker.datatype.number({ min: 8, max: 8 })}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toLowerCase()}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toUpperCase()}@`;
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidNameError(name)));
  });

  it('should not create user if "name" property is null', () => {
    const name: string = null;
    const lastname = faker.lorem.word(2);
    const taxvat = cpf.generate();
    const email = faker.internet.email();
    const password = `${faker.datatype.number({ min: 8, max: 8 })}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toLowerCase()}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toUpperCase()}@`;
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidNameError(name)));
  });

  it('should not create user if "name" property is empty', () => {
    const name = '';
    const lastname = faker.lorem.word(2);
    const taxvat = cpf.generate();
    const email = faker.internet.email();
    const password = `${faker.datatype.number({ min: 8, max: 8 })}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toLowerCase()}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toUpperCase()}@`;
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidNameError(name)));
  });

  it('should not create user if "name" property has only white spaces', () => {
    const name = '    ';
    const lastname = faker.lorem.word(2);
    const taxvat = cpf.generate();
    const email = faker.internet.email();
    const password = `${faker.datatype.number({ min: 8, max: 8 })}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toLowerCase()}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toUpperCase()}@`;
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidNameError(name)));
  });

  it('should not create user if "name" property has only one character - (too few characters)', () => {
    const name = faker.lorem.word(1);
    const lastname = faker.lorem.word(2);
    const taxvat = cpf.generate();
    const email = faker.internet.email();
    const password = `${faker.datatype.number({ min: 8, max: 8 })}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toLowerCase()}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toUpperCase()}@`;
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidNameError(name)));
  });

  it('should not create user if "name" property has more than 255 characters - (too much characters)', () => {
    const name = faker.lorem.word(256);
    const lastname = faker.lorem.word(2);
    const taxvat = cpf.generate();
    const email = faker.internet.email();
    const password = `${faker.datatype.number({ min: 8, max: 8 })}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toLowerCase()}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toUpperCase()}@`;
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidNameError(name)));
  });

  it('should not create user if "lastname" property is undefined', () => {
    const name = faker.lorem.word(2);
    const lastname: string = undefined;
    const taxvat = cpf.generate();
    const email = faker.internet.email();
    const password = `${faker.datatype.number({ min: 8, max: 8 })}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toLowerCase()}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toUpperCase()}@`;
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidLastnameError(lastname)));
  });

  it('should not create user if "lastname" property is null', () => {
    const name = faker.lorem.word(2);
    const lastname: string = null;
    const taxvat = cpf.generate();
    const email = faker.internet.email();
    const password = `${faker.datatype.number({ min: 8, max: 8 })}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toLowerCase()}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toUpperCase()}@`;
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidLastnameError(lastname)));
  });

  it('should not create user if "lastname" property is empty', () => {
    const name = faker.lorem.word(2);
    const lastname = '';
    const taxvat = cpf.generate();
    const email = faker.internet.email();
    const password = `${faker.datatype.number({ min: 8, max: 8 })}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toLowerCase()}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toUpperCase()}@`;
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidLastnameError(lastname)));
  });

  it('should not create user if "lastname" property has only white spaces', () => {
    const name = faker.lorem.word(2);
    const lastname = '    ';
    const taxvat = cpf.generate();
    const email = faker.internet.email();
    const password = `${faker.datatype.number({ min: 8, max: 8 })}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toLowerCase()}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toUpperCase()}@`;
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidLastnameError(lastname)));
  });

  it('should not create user if "lastname" property has only one character - (too few characters)', () => {
    const name = faker.lorem.word(2);
    const lastname = faker.lorem.word(1);
    const taxvat = cpf.generate();
    const email = faker.internet.email();
    const password = `${faker.datatype.number({ min: 8, max: 8 })}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toLowerCase()}${faker.lorem
      .word(faker.datatype.number({ min: 1, max: 2 }))
      .toUpperCase()}@`;
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidLastnameError(lastname)));
  });
});
