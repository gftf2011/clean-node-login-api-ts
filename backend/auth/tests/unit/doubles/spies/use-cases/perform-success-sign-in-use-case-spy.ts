import { Either, right } from '../../../../../src/shared';
// eslint-disable-next-line sort-imports
import {
  AccountDto,
  AuthenticatedAccountDto,
  ISignInUseCase,
} from '../../../../../src/use-cases/ports';

interface PerformFunction {
  request: any[];
  host: string[];
  response: any[];
}

interface Parameters {
  perform: PerformFunction;
}

export class PerformSuccessSignInUseCaseSpy implements ISignInUseCase {
  private parameters: Parameters = {
    perform: {
      host: [],
      request: [],
      response: [],
    },
  };

  private performCall = 0;

  getPerformCalls(): number {
    return this.performCall;
  }

  getParameters(): Parameters {
    return this.parameters;
  }

  perform(
    request: AccountDto,
    host: string,
  ): Promise<Either<Error, AuthenticatedAccountDto>> {
    this.performCall++;
    this.parameters.perform.request.push(request);
    this.parameters.perform.host.push(host);
    this.parameters.perform.response.push(
      right({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      } as AuthenticatedAccountDto),
    );
    return right({
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    } as AuthenticatedAccountDto) as any;
  }
}
