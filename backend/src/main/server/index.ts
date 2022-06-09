import http from 'http'

import app from '@/main/config/setup-app'

export const server = http.createServer(app)
