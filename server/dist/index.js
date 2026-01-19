// @bun
// server/index.ts
import { createForge, forgeRouter } from "@lifeforge/server-utils";
import z from "zod";

// server/constants.ts
var FMP_BASE_URL = "https://financialmodelingprep.com";
var FMP_ENDPOINTS = {
  searchSymbol: (keywords, apikey) => `${FMP_BASE_URL}/stable/search-symbol?query=${encodeURIComponent(keywords)}&limit=10&apikey=${apikey}`,
  searchName: (keywords, apikey) => `${FMP_BASE_URL}/stable/search-name?query=${encodeURIComponent(keywords)}&limit=10&apikey=${apikey}`,
  historicalPrice: (symbol, apikey) => `${FMP_BASE_URL}/stable/historical-price-eod/full?symbol=${symbol}&apikey=${apikey}`,
  quote: (symbol, apikey) => `${FMP_BASE_URL}/stable/quote?symbol=${symbol}&apikey=${apikey}`
};

// server/index.ts
var forge = createForge({});
var search = forge.query().description("Fetch a list of stock for search bar.").input({
  query: z.object({
    keywords: z.string()
  })
}).callback(async ({
  query: { keywords },
  pb,
  core: {
    logging,
    api: { getAPIKey }
  }
}) => {
  const apiKey = await getAPIKey("fmp", pb);
  const [symbolResults, nameResults] = await Promise.all([
    fetch(FMP_ENDPOINTS.searchSymbol(keywords, apiKey)).then((res) => res.json()),
    fetch(FMP_ENDPOINTS.searchName(keywords, apiKey)).then((res) => res.json())
  ]);
  logging.info(`FMP Symbol Search Response: ${JSON.stringify(symbolResults)}`);
  logging.info(`FMP Name Search Response: ${JSON.stringify(nameResults)}`);
  const combinedResults = [];
  const seenSymbols = new Set;
  if (Array.isArray(symbolResults)) {
    for (const item of symbolResults) {
      const symbol = item.symbol || "";
      if (symbol && !seenSymbols.has(symbol)) {
        seenSymbols.add(symbol);
        combinedResults.push(item);
      }
    }
  }
  if (Array.isArray(nameResults)) {
    for (const item of nameResults) {
      const symbol = item.symbol || "";
      if (symbol && !seenSymbols.has(symbol)) {
        seenSymbols.add(symbol);
        combinedResults.push(item);
      }
    }
  }
  if (combinedResults.length === 0) {
    logging.info(`No results for query: ${keywords}`);
    return { bestMatches: [] };
  }
  const bestMatches = combinedResults.map((item) => {
    const itemName = item.name || "";
    const itemSymbol = item.symbol || "";
    const itemCurrency = item.currency || "USD";
    const itemExchange = item.exchangeShortName || "";
    let securityType = "Equity";
    if (itemName.toUpperCase().includes("ETF")) {
      securityType = "ETF";
    } else if (itemName.toUpperCase().includes("FUND")) {
      securityType = "Mutual Fund";
    } else if (["NASDAQ", "NYSE", "AMEX", "NYSE ARCA", "BATS"].includes(itemExchange)) {
      securityType = "Equity";
    }
    return {
      "1. symbol": itemSymbol,
      "2. name": itemName,
      "3. type": securityType,
      "4. region": itemCurrency === "USD" ? "United States" : "Other",
      "5. marketOpen": "09:30",
      "6. marketClose": "16:00",
      "7. timezone": "US/Eastern",
      "8. currency": itemCurrency,
      "9. matchScore": "1.0000"
    };
  });
  logging.info(`Found ${bestMatches.length} matches`);
  return { bestMatches };
});
var getStock = forge.query().description("Fetch daily time series data for a stock symbol.").input({
  query: z.object({
    symbol: z.string()
  })
}).callback(async ({
  query: { symbol },
  pb,
  core: {
    logging,
    api: { getAPIKey }
  }
}) => {
  const apiKey = await getAPIKey("fmp", pb);
  const response = await fetch(FMP_ENDPOINTS.historicalPrice(symbol, apiKey));
  const responseText = await response.text();
  if (responseText.startsWith("Premium")) {
    throw new Error("API_PLAN_LIMIT: This stock is not available on your current API plan");
  }
  const results = JSON.parse(responseText);
  logging.info(`FMP Historical Response: ${JSON.stringify(results).substring(0, 500)}`);
  if (results.Error || results["Error Message"]) {
    const errorMsg = results.Error || results["Error Message"];
    logging.error("FMP API Error", errorMsg);
    if (errorMsg.toLowerCase().includes("upgrade") || errorMsg.toLowerCase().includes("plan") || errorMsg.toLowerCase().includes("limit") || errorMsg.toLowerCase().includes("premium") || response.status === 403 || response.status === 429) {
      throw new Error("API_PLAN_LIMIT: This stock is not available on your current API plan");
    }
    throw new Error("Invalid stock symbol");
  }
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("API_PLAN_LIMIT: This stock is not available on your current API plan");
  }
  const data = results.map((item) => ({
    date: item.date,
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    volume: item.volume
  }));
  return {
    symbol,
    lastRefreshed: results[0]?.date || new Date().toISOString().split("T")[0],
    data
  };
});
var getQuote = forge.query().description("Fetch real-time quote for a stock symbol.").input({
  query: z.object({
    symbol: z.string()
  })
}).callback(async ({
  query: { symbol },
  pb,
  core: {
    api: { getAPIKey }
  }
}) => {
  const apikey = await getAPIKey("fmp", pb);
  const response = await fetch(FMP_ENDPOINTS.quote(symbol, apikey));
  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) {
    if (results["Error Message"]) {
      throw new Error(`Error from FMP API: ${results["Error Message"]}`);
    }
    throw new Error("Failed to fetch quote");
  }
  const quote = results[0];
  return {
    symbol: quote.symbol,
    price: quote.price,
    change: quote.change,
    changePercent: quote.changePercentage
  };
});
var server_default = forgeRouter({
  search,
  getStock,
  getQuote
});
export {
  server_default as default
};
