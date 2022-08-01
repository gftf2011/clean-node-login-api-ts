import { IHashService } from '../../../../../../../src/use-cases/ports';

export class CryptoHashServiceDummy implements IHashService {
  encode: (password: string, salt: string) => string;

  compare: (password: string, salt: string, hashedPassword: string) => boolean;
}
