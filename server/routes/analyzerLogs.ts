import { eq } from 'drizzle-orm'
import z from 'zod'

import forge from '../forge'
import { analyzerLogs } from '../schema.drizzle'

const analyzerLogDto = z.object({
  id: z.string(),
  ticker: z.string(),
  stock_exchange: z.string(),
  company_name: z.string(),
  date: z.date(),
  values: z.record(z.string(), z.union([z.number(), z.string()])),
  scores: z.record(z.string(), z.number()),
  quantitative: z.record(z.string(), z.boolean())
})

const analyzerLogInputDto = z.object({
  ticker: z.string(),
  stock_exchange: z.string(),
  company_name: z.string(),
  date: z.string(),
  values: z.record(z.string(), z.union([z.number(), z.string()])),
  scores: z.record(z.string(), z.number()),
  quantitative: z.record(z.string(), z.boolean())
})

export const list = forge
  .query({
    description: 'List all analyzer logs, newest first.',
    output: {
      OK: z.array(analyzerLogDto)
    }
  })
  .callback(async ({ db, response }) =>
    response.ok(
      await db.query.analyzer_logs.findMany({
        orderBy: { date: 'desc' }
      })
    )
  )

export const create = forge
  .mutation({
    description: 'Create a new analyzer log.',
    input: {
      body: analyzerLogInputDto
    },
    output: {
      CREATED: analyzerLogDto
    }
  })
  .callback(async ({ db, body, response }) => {
    const [created] = await db
      .insert(analyzerLogs)
      .values({
        ticker: body.ticker,
        stock_exchange: body.stock_exchange,
        company_name: body.company_name,
        date: new Date(body.date),
        values: body.values,
        scores: body.scores,
        quantitative: body.quantitative
      })
      .returning()

    return response.created(created!)
  })

export const update = forge
  .mutation({
    description: 'Update an analyzer log.',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), analyzerLogs)
      }),
      body: analyzerLogInputDto.partial()
    },
    output: {
      OK: analyzerLogDto
    }
  })
  .callback(async ({ db, body, query: { id }, response }) => {
    const { date, ...rest } = body

    const [updated] = await db
      .update(analyzerLogs)
      .set({
        ...rest,
        ...(date ? { date: new Date(date) } : {})
      })
      .where(eq(analyzerLogs.id, id))
      .returning()

    return response.ok(updated!)
  })

export const remove = forge
  .mutation({
    description: 'Delete an analyzer log.',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), analyzerLogs)
      })
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ db, query: { id }, response }) => {
    await db.delete(analyzerLogs).where(eq(analyzerLogs.id, id))

    return response.noContent()
  })

export const clearAll = forge
  .mutation({
    description: 'Delete all analyzer logs.',
    output: {
      OK: z.object({
        deleted: z.number()
      })
    }
  })
  .callback(async ({ db, response }) => {
    const deleted = await db
      .delete(analyzerLogs)
      .returning({ id: analyzerLogs.id })

    return response.ok({ deleted: deleted.length })
  })
