import { IHashService } from '../../../../../../../src/use-cases/ports';

export class OnlyCallSamePasswordByParameterHashServiceStub
  implements IHashService
{
  encode(password: string, _salt: string): string {
    return password;
  }

  compare(password: string, salt: string, hashedPassword: string): boolean {
    if (`${password}_${salt}` === hashedPassword) {
      return true;
    }
    return false;
  }
}
