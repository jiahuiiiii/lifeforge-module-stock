import { eq } from 'drizzle-orm'
import z from 'zod'

import forge from '../forge'
import { calculatorLogs } from '../schema.drizzle'

const valueAndScoreDto = z.record(
  z.string(),
  z.object({
    value: z.number().optional(),
    score: z.number()
  })
)

const calculatorLogDto = z.object({
  id: z.string(),
  ticker: z.string(),
  name: z.string(),
  exchange: z.string(),
  date: z.date(),
  values_and_scores: valueAndScoreDto,
  total_score: z.number()
})

const calculatorLogInputDto = z.object({
  ticker: z.string(),
  name: z.string(),
  exchange: z.string(),
  date: z.string(),
  values_and_scores: valueAndScoreDto,
  total_score: z.number()
})

export const list = forge
  .query({
    description: 'List all calculator logs, newest first.',
    output: {
      OK: z.array(calculatorLogDto)
    }
  })
  .callback(async ({ db, response }) =>
    response.ok(
      await db.query.calculator_logs.findMany({
        orderBy: { date: 'desc' }
      })
    )
  )

export const create = forge
  .mutation({
    description: 'Create a new calculator log.',
    input: {
      body: calculatorLogInputDto
    },
    output: {
      CREATED: calculatorLogDto
    }
  })
  .callback(async ({ db, body, response }) => {
    const [created] = await db
      .insert(calculatorLogs)
      .values({
        ticker: body.ticker,
        name: body.name,
        exchange: body.exchange,
        date: new Date(body.date),
        values_and_scores: body.values_and_scores,
        total_score: body.total_score
      })
      .returning()

    return response.created(created!)
  })

export const update = forge
  .mutation({
    description: 'Update a calculator log.',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), calculatorLogs)
      }),
      body: calculatorLogInputDto.partial()
    },
    output: {
      OK: calculatorLogDto
    }
  })
  .callback(async ({ db, body, query: { id }, response }) => {
    const { date, ...rest } = body

    const [updated] = await db
      .update(calculatorLogs)
      .set({
        ...rest,
        ...(date ? { date: new Date(date) } : {})
      })
      .where(eq(calculatorLogs.id, id))
      .returning()

    return response.ok(updated!)
  })

export const remove = forge
  .mutation({
    description: 'Delete a calculator log.',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), calculatorLogs)
      })
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ db, query: { id }, response }) => {
    await db.delete(calculatorLogs).where(eq(calculatorLogs.id, id))

    return response.noContent()
  })

export const clearAll = forge
  .mutation({
    description: 'Delete all calculator logs.',
    output: {
      OK: z.object({
        deleted: z.number()
      })
    }
  })
  .callback(async ({ db, response }) => {
    const deleted = await db
      .delete(calculatorLogs)
      .returning({ id: calculatorLogs.id })

    return response.ok({ deleted: deleted.length })
  })
