import dayjs from 'dayjs'

import type { IPBService } from '../../../../packages/lifeforge-server-utils/src'
import { FMP_ENDPOINTS } from '../constants'
import type schema from '../schema'

interface QuoteResponse {
  symbol: string
  price: number
  change: number
  changePercentage: number
}

async function fetchQuote(
  symbol: string,
  apiKey: string
): Promise<QuoteResponse | null> {
  try {
    const response = await fetch(FMP_ENDPOINTS.quote(symbol, apiKey))

    const results = await response.json()

    if (!Array.isArray(results) || results.length === 0) {
      return null
    }

    return results[0] as QuoteResponse
  } catch {
    return null
  }
}

async function recordPortfolioValues(
  pb: IPBService<typeof schema>,
  apiKey: string,
  logging: { info: (msg: string) => void; error: (msg: string) => void }
) {
  const now = dayjs()

  const currentHHMM = now.format('HH:mm')

  const todayDate = now.format('YYYY-MM-DD')

  logging.info(`[ValueRecordingService] Checking portfolios at ${currentHHMM}`)

  const portfolios = await pb.getFullList.collection('portfolios').execute()

  for (const portfolio of portfolios) {
    const closingTime = dayjs(portfolio.closingTime)

    const portfolioHHMM = closingTime.format('HH:mm')

    if (portfolioHHMM !== currentHHMM) {
      continue
    }

    logging.info(
      `[ValueRecordingService] Portfolio "${portfolio.name}" matches closing time ${portfolioHHMM}`
    )

    const existingEntry = await pb.getFirstListItem
      .collection('portfolio_value_histories')
      .filter([
        { field: 'portfolio', operator: '=', value: portfolio.id },
        { field: 'date', operator: '>=', value: `${todayDate} 00:00:00` },
        { field: 'date', operator: '<', value: `${todayDate} 23:59:59` }
      ])
      .execute()
      .catch(() => null)

    if (existingEntry) {
      logging.info(
        `[ValueRecordingService] Entry already exists for portfolio "${portfolio.name}" today, skipping`
      )
      continue
    }

    const holdings = await pb.getFullList
      .collection('holdings')
      .filter([{ field: 'portfolio', operator: '=', value: portfolio.id }])
      .execute()

    if (holdings.length === 0) {
      logging.info(
        `[ValueRecordingService] Portfolio "${portfolio.name}" has no holdings, skipping`
      )
      continue
    }

    let totalValue = 0

    for (const holding of holdings) {
      const quote = await fetchQuote(holding.symbol, apiKey)

      const currentPrice = quote?.price ?? holding.avgCost

      totalValue += holding.shares * currentPrice
    }

    await pb.create
      .collection('portfolio_value_histories')
      .data({
        portfolio: portfolio.id,
        value: totalValue
      })
      .execute()

    logging.info(
      `[ValueRecordingService] Recorded value $${totalValue.toFixed(2)} for portfolio "${portfolio.name}"`
    )
  }
}

let intervalId: ReturnType<typeof setInterval> | null = null

export function startValueRecordingService(
  pb: IPBService<typeof schema>,
  apiKey: string,
  logging: { info: (msg: string) => void; error: (msg: string) => void }
) {
  if (intervalId) {
    logging.info('[ValueRecordingService] Service already running')

    return
  }

  logging.info('[ValueRecordingService] Starting service (1 minute interval)')

  intervalId = setInterval(
    () => {
      recordPortfolioValues(pb, apiKey, logging).catch(err => {
        logging.error(`[ValueRecordingService] Error: ${err.message}`)
      })
    },
    60 * 1000 // 1 minute
  )
}

export function stopValueRecordingService() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

// TODO: Need to create server service system
