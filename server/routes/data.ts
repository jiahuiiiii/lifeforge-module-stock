import z from 'zod'

import { FMP_ENDPOINTS } from '../constants'
import forge from '../forge'

const searchResultDto = z.object({
  symbol: z.string(),
  name: z.string(),
  type: z.string(),
  region: z.string(),
  currency: z.string(),
  exchange: z.string()
})

const stockDataDto = z.object({
  symbol: z.string(),
  last_refreshed: z.string(),
  data: z.array(
    z.object({
      date: z.string(),
      open: z.number(),
      high: z.number(),
      low: z.number(),
      close: z.number(),
      volume: z.number()
    })
  )
})

const quoteDto = z.object({
  symbol: z.string(),
  price: z.number(),
  change: z.number(),
  change_percent: z.number()
})

interface FmpSearchResult {
  symbol?: string
  name?: string
  currency?: string
  exchangeShortName?: string
}

interface FmpHistoricalResult {
  date?: string
  open?: number
  high?: number
  low?: number
  close?: number
  volume?: number
}

interface FmpQuoteResult {
  symbol?: string
  price?: number
  change?: number
  changePercentage?: number
}

function resolveSecurityType(item: FmpSearchResult) {
  const name = (item.name ?? '').toUpperCase()

  const exchange = item.exchangeShortName ?? ''

  if (name.includes('ETF')) return 'ETF'

  if (name.includes('FUND')) return 'Mutual Fund'

  if (['NASDAQ', 'NYSE', 'AMEX', 'NYSE ARCA', 'BATS'].includes(exchange)) {
    return 'Equity'
  }

  return 'Equity'
}

export const search = forge
  .query({
    description: 'Search stocks by symbol or company name.',
    input: {
      query: z.object({
        keywords: z.string()
      })
    },
    output: {
      OK: z.object({
        results: z.array(searchResultDto)
      })
    }
  })
  .callback(
    async ({
      query: { keywords },
      core: {
        logging,
        api: { getAPIKey }
      },
      response
    }) => {
      const apiKey = await getAPIKey('fmp')

      const [symbolResults, nameResults] = await Promise.all([
        fetch(FMP_ENDPOINTS.searchSymbol(keywords, apiKey)).then(res =>
          res.json()
        ),
        fetch(FMP_ENDPOINTS.searchName(keywords, apiKey)).then(res =>
          res.json()
        )
      ])

      const combined: FmpSearchResult[] = []

      const seenSymbols = new Set<string>()

      for (const list of [symbolResults, nameResults]) {
        if (!Array.isArray(list)) continue

        for (const item of list as FmpSearchResult[]) {
          const symbol = item.symbol ?? ''

          if (!symbol || seenSymbols.has(symbol)) continue

          seenSymbols.add(symbol)
          combined.push(item)
        }
      }

      logging.info(`Found ${combined.length} matches for "${keywords}"`)

      return response.ok({
        results: combined.map(item => {
          const currency = item.currency ?? 'USD'

          return {
            symbol: item.symbol ?? '',
            name: item.name ?? '',
            type: resolveSecurityType(item),
            region: currency === 'USD' ? 'United States' : 'Other',
            currency,
            exchange: item.exchangeShortName ?? ''
          }
        })
      })
    }
  )

export const getStock = forge
  .query({
    description: 'Fetch daily time series data for a stock symbol.',
    input: {
      query: z.object({
        symbol: z.string()
      })
    },
    output: {
      OK: stockDataDto
    }
  })
  .callback(
    async ({
      query: { symbol },
      core: {
        logging,
        api: { getAPIKey }
      },
      response
    }) => {
      const apiKey = await getAPIKey('fmp')

      const apiResponse = await fetch(
        FMP_ENDPOINTS.historicalPrice(symbol, apiKey)
      )

      const responseText = await apiResponse.text()

      if (responseText.startsWith('Premium')) {
        return response.badRequest(
          'API_PLAN_LIMIT: This stock is not available on your current API plan'
        )
      }

      let results: unknown

      try {
        results = JSON.parse(responseText)
      } catch {
        return response.badRequest(
          `Invalid response from FMP API for symbol ${symbol}`
        )
      }

      if (!Array.isArray(results) || results.length === 0) {
        return response.badRequest(
          `No data found for the given symbol ${symbol}`
        )
      }

      logging.debug(
        `FMP Historical Response: ${responseText.substring(0, 500)}`
      )

      const data = (results as FmpHistoricalResult[])
        .filter(
          item =>
            typeof item.date === 'string' &&
            [item.open, item.high, item.low, item.close, item.volume].every(
              value => typeof value === 'number' && Number.isFinite(value)
            )
        )
        .map(item => ({
          date: item.date!,
          open: item.open!,
          high: item.high!,
          low: item.low!,
          close: item.close!,
          volume: item.volume!
        }))

      if (data.length === 0) {
        return response.badRequest(
          `No valid data found for the given symbol ${symbol}`
        )
      }

      return response.ok({
        symbol,
        last_refreshed: data[0]!.date,
        data
      })
    }
  )

export const getQuote = forge
  .query({
    description: 'Fetch a real-time quote for a stock symbol.',
    input: {
      query: z.object({
        symbol: z.string()
      })
    },
    output: {
      OK: quoteDto
    }
  })
  .callback(
    async ({
      query: { symbol },
      core: {
        api: { getAPIKey }
      },
      response
    }) => {
      const apiKey = await getAPIKey('fmp')

      const apiResponse = await fetch(FMP_ENDPOINTS.quote(symbol, apiKey))

      const results = await apiResponse.json()

      if (!Array.isArray(results) || results.length === 0) {
        return response.badRequest(
          `Failed to fetch quote for symbol ${symbol}`
        )
      }

      const quote = results[0] as FmpQuoteResult

      const price = quote.price ?? 0

      const change = quote.change ?? 0

      const changePercent = quote.changePercentage ?? 0

      if (![price, change, changePercent].every(Number.isFinite)) {
        return response.badRequest(
          `Invalid quote received for symbol ${symbol}`
        )
      }

      return response.ok({
        symbol: quote.symbol ?? symbol,
        price,
        change,
        change_percent: changePercent
      })
    }
  )
