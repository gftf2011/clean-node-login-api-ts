import http from 'http';

// eslint-disable-next-line sort-imports
import app from '../config/setup-app';

export const server = http.createServer(app);
