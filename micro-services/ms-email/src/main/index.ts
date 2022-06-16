import '../main/bootstrap'

import { server } from '../main/server'

server().then(() => {
  console.log(`Queue consumer listening at ${process.env.RABBITMQ_CONNECTION_URL}`)
}).catch(console.error)
