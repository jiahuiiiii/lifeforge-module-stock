import { type APIRoutes } from '@server/routes.types'
import { createForgeProxy } from 'shared'

if (!import.meta.env.VITE_API_HOST) {
  throw new Error('VITE_API_HOST is not defined')
}

const forgeAPI = createForgeProxy<APIRoutes>(
  import.meta.env.VITE_API_HOST,
  'jiahuiiiii--stock'
)

export default forgeAPI
