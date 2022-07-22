import { IHashService } from '../../../../../../../src/use-cases/ports';

interface EncodeFunction {
  password: string[];
  salt: string[];
  response: string[];
}

interface CompareFunction {
  password: string[];
  salt: string[];
  hashedPassword: string[];
  response: boolean[];
}

interface Parameters {
  encode: EncodeFunction;
  compare: CompareFunction;
}

export class GenericHashServiceSpy implements IHashService {
  private parameters: Parameters = {
    compare: {
      hashedPassword: [],
      password: [],
      response: [],
      salt: [],
    },
    encode: {
      password: [],
      response: [],
      salt: [],
    },
  };

  private encodeCalls = 0;

  private compareCalls = 0;

  getParameters(): Parameters {
    return this.parameters;
  }

  getEncodeCalls(): number {
    return this.encodeCalls;
  }

  getCompareCalls(): number {
    return this.compareCalls;
  }

  encode(password: string, salt: string): string {
    this.encodeCalls++;
    this.parameters.encode.password.push(password);
    this.parameters.encode.salt.push(salt);
    this.parameters.encode.response.push(`hashed_${password}_${salt}`);
    return `hashed_${password}_${salt}`;
  }

  compare(password: string, salt: string, hashedPassword: string): boolean {
    this.compareCalls++;
    this.parameters.compare.password.push(password);
    this.parameters.compare.salt.push(salt);
    this.parameters.compare.hashedPassword.push(hashedPassword);
    this.parameters.compare.response.push(
      `hashed_${password}_${salt}` === hashedPassword,
    );
    if (`hashed_${password}_${salt}` === hashedPassword) {
      return true;
    }
    return false;
  }
}
