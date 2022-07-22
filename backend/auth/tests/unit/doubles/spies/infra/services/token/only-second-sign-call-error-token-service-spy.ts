import { Either, left, right } from '../../../../../../../src/shared';
import { ServerError } from '../../../../../../../src/shared/errors';
// eslint-disable-next-line sort-imports
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

export class OnlySecondSignCallErrorTokenServiceSpy implements ITokenService {
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

  sign(
    payload: any,
    options: TokenOptions,
    expirationTime: number,
  ): Either<Error, string> {
    let answer: any;

    this.parameters.sign.expirationTime.push(expirationTime);
    this.parameters.sign.options.push(options);
    this.parameters.sign.payload.push(payload);

    if (this.signCalls === 1) {
      this.signCalls++;
      this.parameters.sign.response.push(left(new ServerError()));
      answer = left(new ServerError());
      return answer;
    }
    this.signCalls++;
    this.parameters.sign.response.push(right('jsonWebToken'));
    return right('jsonWebToken');
  }

  verify(token: string, options: TokenOptions): Either<Error, any> {
    this.verifyCalls++;
    this.parameters.verify.token.push(token);
    this.parameters.verify.options.push(options);
    this.parameters.verify.response.push(right({ data: {} }));
    return right({ data: {} });
  }
}
