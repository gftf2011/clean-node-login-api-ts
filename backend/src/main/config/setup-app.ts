
import express from 'express'
import setupMiddlewares from '@/main/config/setup-middlewares'
import setupRoutes from '@/main/config/setup-routes'

const app = express()
setupMiddlewares(app)
setupRoutes(app)

export default app
