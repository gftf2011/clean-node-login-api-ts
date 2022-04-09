import 'module-alias/register'
import '@/main/bootstrap'

import { loader } from '@/main/loader'

import { server } from '@/main/server'

import cluster from 'cluster'
import os from 'os'
import process from 'process'

if (cluster.isPrimary) {
  os.cpus().forEach(() => cluster.fork())
} else {
  loader().then(() => {
    server.listen(process.env.PORT, () => console.log(`Server ${process.pid} running at http://localhost:${process.env.PORT}`))
  }).catch(console.error)
}
