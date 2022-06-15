import http from 'http'

import app from '../config/setup-app'

export const server = http.createServer(app)
