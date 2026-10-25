import { eq } from 'drizzle-orm'
import z from 'zod'

import forge from '../forge'
import { portfolios } from '../schema.drizzle'
import { holdingDto, portfolioDto, valueHistoryDto } from '../utils/dto'

export const getById = forge
  .query({
    description: 'Get a portfolio by id, including its holdings and value history.',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), portfolios)
      })
    },
    output: {
      OK: portfolioDto.extend({
        holdings: z.array(holdingDto),
        value_history: z.array(valueHistoryDto)
      })
    }
  })
  .callback(async ({ db, query: { id }, response }) => {
    const portfolio = await db.query.portfolios.findFirst({
      where: { id }
    })

    if (!portfolio) {
      return response.notFound()
    }

    const portfolioHoldings = await db.query.holdings.findMany({
      where: { portfolio: id },
      orderBy: { date_added: 'desc' }
    })

    const valueHistory = await db.query.portfolio_value_histories.findMany({
      where: { portfolio: id },
      orderBy: { date: 'asc' }
    })

    return response.ok({
      ...portfolio,
      holdings: portfolioHoldings,
      value_history: valueHistory
    })
  })

export const list = forge
  .query({
    description: 'List all portfolios with their holding count and latest value.',
    output: {
      OK: z.array(
        portfolioDto.extend({
          holding_count: z.number(),
          latest_value: z.number()
        })
      )
    }
  })
  .callback(async ({ db, response }) => {
    const allPortfolios = await db.query.portfolios.findMany({
      orderBy: { name: 'asc' }
    })

    const allHoldings = await db.query.holdings.findMany()

    const allHistories = await db.query.portfolio_value_histories.findMany({
      orderBy: { date: 'asc' }
    })

    return response.ok(
      allPortfolios.map(portfolio => {
        const portfolioHoldings = allHoldings.filter(
          holding => holding.portfolio === portfolio.id
        )

        const portfolioHistories = allHistories.filter(
          history => history.portfolio === portfolio.id
        )

        return {
          ...portfolio,
          holding_count: portfolioHoldings.length,
          latest_value:
            portfolioHistories[portfolioHistories.length - 1]?.value ?? 0
        }
      })
    )
  })

const portfolioInputDto = z.object({
  name: z.string(),
  closing_time: z.string()
})

export const create = forge
  .mutation({
    description: 'Create a new portfolio.',
    input: {
      body: portfolioInputDto
    },
    output: {
      CREATED: portfolioDto
    }
  })
  .callback(async ({ db, body, response }) => {
    const [created] = await db
      .insert(portfolios)
      .values({
        name: body.name,
        closing_time: new Date(body.closing_time)
      })
      .returning()

    return response.created(created!)
  })

export const update = forge
  .mutation({
    description: 'Update a portfolio.',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), portfolios)
      }),
      body: portfolioInputDto
    },
    output: {
      OK: portfolioDto
    }
  })
  .callback(async ({ db, query: { id }, body, response }) => {
    const [updated] = await db
      .update(portfolios)
      .set({
        name: body.name,
        closing_time: new Date(body.closing_time)
      })
      .where(eq(portfolios.id, id))
      .returning()

    return response.ok(updated!)
  })

export const remove = forge
  .mutation({
    description: 'Delete a portfolio.',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), portfolios)
      })
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ db, query: { id }, response }) => {
    await db.delete(portfolios).where(eq(portfolios.id, id))

    return response.noContent()
  })
