class JwtMock {
  sign(payload: any, _secretOrPrivateKey: any, _options?: any): string {
    return JSON.stringify(payload);
  }

  verify(token: string, _secretOrPublicKey: any, _options?: any): any {
    return JSON.parse(token);
  }
}

const jwt = new JwtMock();

export default jwt;
