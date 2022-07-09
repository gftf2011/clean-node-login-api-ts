import { Router } from 'express';
import { adaptRoute } from '../adapters/express-route-adapter';
import { makeSignInController } from '../factories/controllers/sign-in-controller-factory';

export default (router: Router): void => {
  router.post('/sign-in', adaptRoute(makeSignInController()));
};
