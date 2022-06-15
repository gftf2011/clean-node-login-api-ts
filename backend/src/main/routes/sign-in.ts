import { Router } from 'express'
import { makeSignInController } from '../factories/controllers/sign-in-controller-factory'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/sign-in', adaptRoute(makeSignInController()))
}
