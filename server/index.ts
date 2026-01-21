import { forgeRouter } from '@lifeforge/server-utils'

import * as dataRoutes from './routes/data'
import * as diaryRoutes from './routes/diary'
import * as portfolioHoldingsRoutes from './routes/portfolioHoldings'
import * as portfoliosRoutes from './routes/portfolios'

export default forgeRouter({
  data: dataRoutes,
  portfolios: {
    ...portfoliosRoutes,
    holdings: portfolioHoldingsRoutes
  },
  diary: diaryRoutes
})
