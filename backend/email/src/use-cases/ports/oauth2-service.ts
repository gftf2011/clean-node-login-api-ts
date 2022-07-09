export interface OAuth2Service {
  getAccessToken: (
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    refreshToken: string,
  ) => Promise<string>;
}
