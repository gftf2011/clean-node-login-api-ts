import 'module-alias/register'
import '@/main/bootstrap'

import { loader } from '@/main/loader'

import { server } from '@/main/server'

loader().then(() => {
  server.listen(process.env.PORT, () => console.log(`Server running at http://localhost:${process.env.PORT}`))
}).catch(console.error)
