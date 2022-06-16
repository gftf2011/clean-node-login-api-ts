import app from '../config/setup-app'

import http from 'http'

export const server = http.createServer(app)
