import { Either, left, right } from '../../../../../../../src/shared';
import { ServerError } from '../../../../../../../src/shared/errors';
// eslint-disable-next-line sort-imports
import {
  ITokenService,
  TokenOptions,
} from '../../../../../../../src/use-cases/ports';

export class OnlySecondSignCallErrorTokenServiceStub implements ITokenService {
  private signCalls = 0;

  sign(
    _payload: any,
    _options: TokenOptions,
    _expirationTime: number,
  ): Promise<Either<Error, string>> {
    if (this.signCalls === 1) {
      this.signCalls++;
      return Promise.resolve(left(new ServerError()));
    }
    this.signCalls++;
    return Promise.resolve(right('jsonWebToken'));
  }

  verify(_token: string, _options: TokenOptions): Promise<Either<Error, any>> {
    return Promise.resolve(right({ data: {} }));
  }
}
