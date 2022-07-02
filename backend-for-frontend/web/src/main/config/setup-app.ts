import express from 'express'
import setupMiddlewares from '../config/setup-middlewares'
import setupRoutes from '../config/setup-routes'

const app = express()
setupMiddlewares(app)
setupRoutes(app)

export default app
