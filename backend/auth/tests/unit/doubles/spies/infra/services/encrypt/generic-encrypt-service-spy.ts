import { IEncryptService } from '../../../../../../../src/use-cases/ports';

interface EncodeFunction {
  secret: string[];
  response: string[];
}

interface DecodeFunction {
  encrypt: string[];
  response: string[];
}

interface Parameters {
  encode: EncodeFunction;
  decode: DecodeFunction;
}

export class GenericEncryptServiceSpy implements IEncryptService {
  private parameters: Parameters = {
    decode: {
      encrypt: [],
      response: [],
    },
    encode: {
      response: [],
      secret: [],
    },
  };

  private encodeCalls = 0;

  private decodeCalls = 0;

  getParameters(): Parameters {
    return this.parameters;
  }

  getEncodeCalls(): number {
    return this.encodeCalls;
  }

  getDecodeCalls(): number {
    return this.decodeCalls;
  }

  encode(secret: string): string {
    this.encodeCalls++;
    this.parameters.encode.secret.push(secret);
    this.parameters.encode.response.push(`none_${secret}`);
    return `none_${secret}`;
  }

  decode(encrypt: string): string {
    this.decodeCalls++;
    this.parameters.decode.encrypt.push(encrypt);
    this.parameters.decode.response.push(`none_${encrypt}`);
    return `none_${encrypt}`;
  }
}
