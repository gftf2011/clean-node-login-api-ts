import { IHashService } from '../../../../../../../src/use-cases/ports';

export class FakeNoneHashService implements IHashService {
  encode(password: string, salt: string): string {
    return `${password}_${salt}`;
  }

  compare(password: string, salt: string, hashedPassword: string): boolean {
    if (`${password}_${salt}` === hashedPassword) {
      return true;
    }
    return false;
  }
}
