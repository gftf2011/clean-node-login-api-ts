import { IEncryptService } from '../../../../../../../src/use-cases/ports';

export class FakeNoneEncryptService implements IEncryptService {
  encode(secret: string): string {
    return `none_${secret}`;
  }

  decode(encrypt: string): string {
    return `none_${encrypt}`;
  }
}
