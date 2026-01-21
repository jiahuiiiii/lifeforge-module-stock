import { forgeRouter } from '@lifeforge/server-utils'
import z from 'zod'

import { FMP_ENDPOINTS } from '../constants'
import forge from '../forge'

interface SearchResults {
  bestMatches: BestMatch[]
}

interface BestMatch {
  '1. symbol': string
  '2. name': string
  '3. type': string
  '4. region': string
  '5. marketOpen': string
  '6. marketClose': string
  '7. timezone': string
  '8. currency': string
  '9. matchScore': string
}

// FMP API search endpoint
export const search = forge
  .query()
  .description('Fetch a list of stock for search bar.')
  .input({
    query: z.object({
      keywords: z.string()
    })
  })
  .callback(
    async ({
      query: { keywords },
      pb,
      core: {
        logging,
        api: { getAPIKey }
      }
    }) => {
      const apiKey = await getAPIKey('fmp', pb)

      const [symbolResults, nameResults] = await Promise.all([
        fetch(FMP_ENDPOINTS.searchSymbol(keywords, apiKey)).then(res =>
          res.json()
        ),
        fetch(FMP_ENDPOINTS.searchName(keywords, apiKey)).then(res =>
          res.json()
        )
      ])

      logging.info(
        `FMP Symbol Search Response: ${JSON.stringify(symbolResults)}`
      )
      logging.info(`FMP Name Search Response: ${JSON.stringify(nameResults)}`)

      const combinedResults: Record<string, unknown>[] = []

      const seenSymbols = new Set<string>()

      if (Array.isArray(symbolResults)) {
        for (const item of symbolResults) {
          const symbol = (item.symbol as string) || ''

          if (symbol && !seenSymbols.has(symbol)) {
            seenSymbols.add(symbol)
            combinedResults.push(item as Record<string, unknown>)
          }
        }
      }

      if (Array.isArray(nameResults)) {
        for (const item of nameResults) {
          const symbol = (item.symbol as string) || ''

          if (symbol && !seenSymbols.has(symbol)) {
            seenSymbols.add(symbol)
            combinedResults.push(item as Record<string, unknown>)
          }
        }
      }

      if (combinedResults.length === 0) {
        logging.info(`No results for query: ${keywords}`)

        return { bestMatches: [] } as SearchResults
      }

      const bestMatches: BestMatch[] = combinedResults.map(
        (item: Record<string, unknown>) => {
          const itemName = (item.name as string) || ''

          const itemSymbol = (item.symbol as string) || ''

          const itemCurrency = (item.currency as string) || 'USD'

          const itemExchange = (item.exchangeShortName as string) || ''

          let securityType = 'Equity'

          if (itemName.toUpperCase().includes('ETF')) {
            securityType = 'ETF'
          } else if (itemName.toUpperCase().includes('FUND')) {
            securityType = 'Mutual Fund'
          } else if (
            ['NASDAQ', 'NYSE', 'AMEX', 'NYSE ARCA', 'BATS'].includes(
              itemExchange
            )
          ) {
            securityType = 'Equity'
          }

          return {
            '1. symbol': itemSymbol,
            '2. name': itemName,
            '3. type': securityType,
            '4. region': itemCurrency === 'USD' ? 'United States' : 'Other',
            '5. marketOpen': '09:30',
            '6. marketClose': '16:00',
            '7. timezone': 'US/Eastern',
            '8. currency': itemCurrency,
            '9. matchScore': '1.0000'
          }
        }
      )

      logging.info(`Found ${bestMatches.length} matches`)

      return { bestMatches } as SearchResults
    }
  )

export const getStock = forge
  .query()
  .description('Fetch daily time series data for a stock symbol.')
  .input({
    query: z.object({
      symbol: z.string()
    })
  })
  .callback(
    async ({
      query: { symbol },
      pb,
      core: {
        logging,
        api: { getAPIKey }
      }
    }) => {
      const apiKey = await getAPIKey('fmp', pb)

      const response = await fetch(
        FMP_ENDPOINTS.historicalPrice(symbol, apiKey)
      )

      const responseText = await response.text()

      if (responseText.startsWith('Premium')) {
        throw new Error(
          'API_PLAN_LIMIT: This stock is not available on your current API plan'
        )
      }

      const results = JSON.parse(responseText)

      if (results.Error || results['Error Message']) {
        const errorMsg = results.Error || results['Error Message']

        throw new Error(errorMsg)
      }

      if (!Array.isArray(results) || results.length === 0) {
        throw new Error(
          `Error from FMP API: No data found for the given symbol ${symbol}`
        )
      }

      logging.debug(
        `FMP Historical Response: ${JSON.stringify(results).substring(0, 500)}`
      )

      const data = results.map((item: any) => ({
        date: item.date,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume
      }))

      return {
        symbol: symbol,
        lastRefreshed:
          results[0]?.date || new Date().toISOString().split('T')[0],
        data
      }
    }
  )

export const getQuote = forge
  .query()
  .description('Fetch real-time quote for a stock symbol.')
  .input({
    query: z.object({
      symbol: z.string()
    })
  })
  .callback(
    async ({
      query: { symbol },
      pb,
      core: {
        api: { getAPIKey }
      }
    }) => {
      const apikey = await getAPIKey('fmp', pb)

      const response = await fetch(FMP_ENDPOINTS.quote(symbol, apikey))

      const results = await response.json()

      if (!Array.isArray(results) || results.length === 0) {
        if (results['Error Message']) {
          throw new Error(`Error from FMP API: ${results['Error Message']}`)
        }

        throw new Error('Failed to fetch quote')
      }

      const quote = results[0]

      return {
        symbol: quote.symbol,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercentage
      }
    }
  )

export default forgeRouter({
  search,
  getStock,
  getQuote
})
