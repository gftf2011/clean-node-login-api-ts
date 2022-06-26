import '../main/bootstrap'

import { loader } from '../main/loader'

import { server } from '../main/server'

loader().then(() => {
  server()
    .then(() => {
      console.log(
        `Queue consumer listening at ${process.env.RABBITMQ_CONNECTION_URL}`
      )
    })
    .catch(console.error)
})
