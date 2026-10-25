import z from 'zod'

export const holdingDto = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  shares: z.number(),
  avg_cost: z.number(),
  date_added: z.date(),
  portfolio: z.string()
})

export const valueHistoryDto = z.object({
  id: z.string(),
  portfolio: z.string(),
  value: z.number(),
  date: z.date()
})

export const portfolioDto = z.object({
  id: z.string(),
  name: z.string(),
  closing_time: z.date()
})
