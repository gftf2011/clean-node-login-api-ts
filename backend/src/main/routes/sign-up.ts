import { Router } from 'express'
import { makeSignUpController } from '../factories/controllers/sign-up-controller-factory'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/sign-up', adaptRoute(makeSignUpController()))
}
