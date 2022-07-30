import { IEncryptService } from '../../../../../../../src/use-cases/ports';

export class FakeNoneEncryptService implements IEncryptService {
  encode(secret: string): string {
    return `${secret}`;
  }

  decode(encrypt: string): string {
    return `${encrypt}`;
  }
}
