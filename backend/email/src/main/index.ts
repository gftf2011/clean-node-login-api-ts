import './bootstrap';

import process from 'process';
// eslint-disable-next-line sort-imports
import { loader } from './loader';

import { server } from './server';

loader().then(() => {
  server()
    .then(() => {
      console.log(
        `Queue consumer ${process.pid} listening at ${process.env.RABBITMQ_CONNECTION_URL}`,
      );
    })
    .catch(console.error);
});
