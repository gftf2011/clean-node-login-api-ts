import { IEncryptService } from '../../../../../../../src/use-cases/ports';

export class CryptoEncryptServiceDummy implements IEncryptService {
  encode: (secret: string) => string;

  decode: (encrypt: string) => string;
}
