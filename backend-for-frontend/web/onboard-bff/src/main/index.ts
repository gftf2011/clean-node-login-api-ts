import './bootstrap'

import { loader } from './loader'

import { server } from './server'

// eslint-disable-next-line sort-imports
import cluster from 'cluster'
import os from 'os'
import process from 'process'

if (cluster.isPrimary) {
  os.cpus().forEach(() => cluster.fork())
} else {
  loader()
    .then(() => {
      server.listen(process.env.PORT, () =>
        console.log(
          `Server ${process.pid} running at http://localhost:${process.env.PORT}`
        )
      )
    })
    .catch(console.error)
}
