import { eq } from 'drizzle-orm'
import z from 'zod'

import forge from '../forge'
import { holdings, portfolios } from '../schema.drizzle'
import { holdingDto } from '../utils/dto'

const holdingInputDto = z.object({
  symbol: z.string(),
  name: z.string(),
  shares: z.number(),
  avg_cost: z.number(),
  date_added: z.string()
})

export const create = forge
  .mutation({
    description: 'Create a new holding entry for a portfolio.',
    input: {
      query: z.object({
        portfolioId: forge.existsIn(z.string(), portfolios)
      }),
      body: holdingInputDto
    },
    output: {
      CREATED: holdingDto
    }
  })
  .callback(async ({ db, body, query: { portfolioId }, response }) => {
    const [created] = await db
      .insert(holdings)
      .values({
        symbol: body.symbol,
        name: body.name,
        shares: body.shares,
        avg_cost: body.avg_cost,
        date_added: new Date(body.date_added),
        portfolio: portfolioId
      })
      .returning()

    return response.created(created!)
  })

export const update = forge
  .mutation({
    description: 'Update a holding entry for a portfolio.',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), holdings)
      }),
      body: z.object({
        shares: z.number(),
        avg_cost: z.number(),
        date_added: z.string()
      })
    },
    output: {
      OK: holdingDto
    }
  })
  .callback(async ({ db, body, query: { id }, response }) => {
    const [updated] = await db
      .update(holdings)
      .set({
        shares: body.shares,
        avg_cost: body.avg_cost,
        date_added: new Date(body.date_added)
      })
      .where(eq(holdings.id, id))
      .returning()

    return response.ok(updated!)
  })

export const remove = forge
  .mutation({
    description: 'Remove a holding entry from a portfolio.',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), holdings)
      })
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ db, query: { id }, response }) => {
    await db.delete(holdings).where(eq(holdings.id, id))

    return response.noContent()
  })
