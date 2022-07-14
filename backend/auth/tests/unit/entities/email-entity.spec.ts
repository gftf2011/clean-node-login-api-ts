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
});
