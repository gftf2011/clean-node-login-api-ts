import '../main/bootstrap'

import { app } from '../main/server'

app().then(() => {
  console.log(`Queue consumer listening at ${process.env.RABBITMQ_CONNECTION_URL}`)
}).catch(console.error)
