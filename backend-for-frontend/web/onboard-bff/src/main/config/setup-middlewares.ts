import { Express } from 'express';

// eslint-disable-next-line sort-imports
import { bodyParser, contentType, cors } from '../middlewares';

export default (app: Express): void => {
  app.use(bodyParser);
  app.use(contentType);
  app.use(cors);
};
