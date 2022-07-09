export interface IEmailTransporterBuilder {
  setHost: () => void;
  setPort: () => void;
  setUser: () => void;
  setPass: () => void;
  setOauthClient: () => Promise<void>;
  setSecure: () => void;
  build: () => any;
}
