const FMP_BASE_URL = 'https://financialmodelingprep.com'

export const FMP_ENDPOINTS = {
  searchSymbol: (keywords: string, apikey: string) =>
    `${FMP_BASE_URL}/stable/search-symbol?query=${encodeURIComponent(keywords)}&limit=10&apikey=${apikey}`,
  searchName: (keywords: string, apikey: string) =>
    `${FMP_BASE_URL}/stable/search-name?query=${encodeURIComponent(keywords)}&limit=10&apikey=${apikey}`,
  historicalPrice: (symbol: string, apikey: string) =>
    `${FMP_BASE_URL}/stable/historical-price-eod/full?symbol=${symbol}&apikey=${apikey}`,
  quote: (symbol: string, apikey: string) =>
    `${FMP_BASE_URL}/stable/quote?symbol=${symbol}&apikey=${apikey}`
}
