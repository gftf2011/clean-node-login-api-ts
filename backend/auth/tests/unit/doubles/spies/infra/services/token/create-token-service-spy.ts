/**
 * Shared
 */
import { Either, right } from '../../../../../../../src/shared';

/**
 * Use Cases
 */
import {
  ITokenService,
  TokenOptions,
} from '../../../../../../../src/use-cases/ports';

interface SignFunction {
  payload: any[];
  options: TokenOptions[];
  expirationTime: number[];
  response: any[];
}

interface VerifyFunction {
  token: string[];
  options: TokenOptions[];
  response: any[];
}

interface Parameters {
  sign: SignFunction;
  verify: VerifyFunction;
}

export class CreateTokenServiceSpy implements ITokenService {
  private parameters: Parameters = {
    sign: {
      expirationTime: [],
      options: [],
      payload: [],
      response: [],
    },
    verify: {
      options: [],
      response: [],
      token: [],
    },
  };

  private signCalls = 0;

  private verifyCalls = 0;

  getParameters(): Parameters {
    return this.parameters;
  }

  getSignCalls(): number {
    return this.signCalls;
  }

  getVerifyCalls(): number {
    return this.verifyCalls;
  }

  sign<T>(
    payload: T,
    options: TokenOptions,
    expirationTime: number,
  ): Either<Error, string> {
    this.parameters.sign.expirationTime.push(expirationTime);
    this.parameters.sign.options.push(options);
    this.parameters.sign.payload.push(payload);
    this.signCalls++;
    this.parameters.sign.response.push(right('jsonWebToken'));
    return right('jsonWebToken');
  }

  verify: (token: string, options: TokenOptions) => Either<Error, any>;
}
