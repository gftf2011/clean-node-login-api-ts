export interface IEncryptService {
  encode: (secret: string) => string;
  decode: (encrypt: string) => string;
}
