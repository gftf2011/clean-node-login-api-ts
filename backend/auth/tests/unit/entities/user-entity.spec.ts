/**
 * Shared
 */
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
    const lastname = 'notALastname';
    const taxvat = 'notATaxvat';
    const email = 'notAEmail';
    const password = 'notAPassword';
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
    const lastname = 'notALastname';
    const taxvat = 'notATaxvat';
    const email = 'notAEmail';
    const password = 'notAPassword';
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
    const lastname = 'notALastname';
    const taxvat = 'notATaxvat';
    const email = 'notAEmail';
    const password = 'notAPassword';
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
    const lastname = 'notALastname';
    const taxvat = 'notATaxvat';
    const email = 'notAEmail';
    const password = 'notAPassword';
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
    const name = 'o';
    const lastname = 'notALastname';
    const taxvat = 'notATaxvat';
    const email = 'notAEmail';
    const password = 'notAPassword';
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
    const name =
      'oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo';
    const lastname = 'notALastname';
    const taxvat = 'notATaxvat';
    const email = 'notAEmail';
    const password = 'notAPassword';
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
    const name = 'notAName';
    const lastname: string = undefined;
    const taxvat = 'notATaxvat';
    const email = 'notAEmail';
    const password = 'notAPassword';
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
    const name = 'notAName';
    const lastname: string = null;
    const taxvat = 'notATaxvat';
    const email = 'notAEmail';
    const password = 'notAPassword';
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
    const name = 'notAName';
    const lastname = '';
    const taxvat = 'notATaxvat';
    const email = 'notAEmail';
    const password = 'notAPassword';
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
    const name = 'notAName';
    const lastname = '    ';
    const taxvat = 'notATaxvat';
    const email = 'notAEmail';
    const password = 'notAPassword';
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
