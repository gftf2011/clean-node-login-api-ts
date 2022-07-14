/**
 * Entities
 */
import { EmailEntity } from '../../../src/entities';

/**
 * Shared
 */
import { InvalidEmailError } from '../../../src/shared/errors';
import { left } from '../../../src/shared';

describe('Email Entity', () => {
  const generateLongInvalidEmail = (): string => {
    return `${'a'.repeat(64)}@${'d'.repeat(127)}.${'d'.repeat(128)}`;
  };

  const generateInvalidLongEmailAccount = (): string => {
    return `${'a'.repeat(65)}@${'d'.repeat(126)}.${'d'.repeat(126)}`;
  };

  const generateInvalidLongEmailDomain = (): string => {
    return `${'a'.repeat(63)}@${'d'.repeat(127)}.${'d'.repeat(128)}`;
  };

  it('should not create email if "value" property is undefined', () => {
    const email: any = undefined;
    const emailOrError = EmailEntity.create(email);
    expect(emailOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create email if "value" property is null', () => {
    const email: any = null;
    const emailOrError = EmailEntity.create(email);
    expect(emailOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create email if "value" property is empty', () => {
    const email: any = '';
    const emailOrError = EmailEntity.create(email);
    expect(emailOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create email if "value" property has more than 320 characters - (too many characters)', () => {
    const email = generateLongInvalidEmail();
    const emailOrError = EmailEntity.create(email);
    expect(emailOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create email if "value" account property has more than 64 characters - (too many characters)', () => {
    const email = generateInvalidLongEmailAccount();
    const emailOrError = EmailEntity.create(email);
    expect(emailOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create email if "value" domain property has more than 255 characters - (too many characters)', () => {
    const email = generateInvalidLongEmailDomain();
    const emailOrError = EmailEntity.create(email);
    expect(emailOrError).toEqual(left(new InvalidEmailError(email)));
  });
});
