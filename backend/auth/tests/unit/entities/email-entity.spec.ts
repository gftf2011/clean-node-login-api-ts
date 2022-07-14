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

  const generateInvalidEmailWithEndingDot = (): string => {
    return `${'a'.repeat(63)}.@${'d'.repeat(127)}.${'d'.repeat(126)}`;
  };

  const generateInvalidEmailWithNoAccount = (): string => {
    return `@${'d'.repeat(127)}.${'d'.repeat(127)}`;
  };

  const generateInvalidEmailAccountWithTwoDots = (): string => {
    return `${'a'.repeat(31)}..${'a'.repeat(31)}@${'d'.repeat(
      127,
    )}.${'d'.repeat(127)}`;
  };

  const generateInvalidEmailAccountWithInvalidChar = (): string => {
    return `${'a'.repeat(32)} ${'a'.repeat(31)}@${'d'.repeat(127)}.${'d'.repeat(
      127,
    )}`;
  };

  const generateInvalidEmailWithNoDomain = (): string => {
    return `${'a'.repeat(64)}@`;
  };

  const generateInvalidDomainEmailWithNoDotSeparator = (): string => {
    return `${'a'.repeat(64)}@${'d'.repeat(127)}`;
  };

  const generateInvalidDomainEmailWithTwoDotsSeparator = (): string => {
    return `${'a'.repeat(64)}@${'d'.repeat(127)}..${'d'.repeat(126)}`;
  };

  const generateInvalidDomainEmailWithLocalPartTooLong = (): string => {
    return `${'a'.repeat(64)}@${'d'.repeat(128)}.${'d'.repeat(126)}`;
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

  it('should not create email if "value" account has an ending dot', () => {
    const email = generateInvalidEmailWithEndingDot();
    const emailOrError = EmailEntity.create(email);
    expect(emailOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create email if "value" account has 0 characters - (too few characters)', () => {
    const email = generateInvalidEmailWithNoAccount();
    const emailOrError = EmailEntity.create(email);
    expect(emailOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create enail if "value" account has 2 dots', () => {
    const email = generateInvalidEmailAccountWithTwoDots();
    const emailOrError = EmailEntity.create(email);
    expect(emailOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create email if "value" account has invalid character', () => {
    const email = generateInvalidEmailAccountWithInvalidChar();
    const emailOrError = EmailEntity.create(email);
    expect(emailOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create email if "value" domain has 0 characters - (too few characters)', () => {
    const email = generateInvalidEmailWithNoDomain();
    const emailOrError = EmailEntity.create(email);
    expect(emailOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create email if "value" domain does not have a dot separator', () => {
    const email = generateInvalidDomainEmailWithNoDotSeparator();
    const emailOrError = EmailEntity.create(email);
    expect(emailOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create email if "value" domain has 2 dot separators', () => {
    const email = generateInvalidDomainEmailWithTwoDotsSeparator();
    const emailOrError = EmailEntity.create(email);
    expect(emailOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create email if "value" domain part has more than 127 characters - (too many characters)', () => {
    const email = generateInvalidDomainEmailWithLocalPartTooLong();
    const emailOrError = EmailEntity.create(email);
    expect(emailOrError).toEqual(left(new InvalidEmailError(email)));
  });
});
