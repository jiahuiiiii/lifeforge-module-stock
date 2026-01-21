import type { SchemaWithPB } from '@lifeforge/server-utils'
import z from 'zod'

import forge from '../forge'

export const getById = forge
  .query()
  .description('Get a portfolio by id')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'portfolios'
  })
  .callback(async ({ pb, query }) => {
    const target = await pb.getOne
      .collection('portfolios')
      .id(query.id)
      .execute()

    const holdings = await pb.getFullList
      .collection('holdings')
      .filter([
        {
          field: 'portfolio',
          operator: '=',
          value: query.id
        }
      ])
      .sort(['-dateAdded'])
      .execute()

    const valueHistory = await pb.getFullList
      .collection('portfolio_value_histories')
      .filter([
        {
          field: 'portfolio',
          operator: '=',
          value: query.id
        }
      ])
      .sort(['date'])
      .execute()

    return {
      ...target,
      holdings,
      valueHistory
    }
  })

export const list = forge
  .query()
  .description('List all portfolios')
  .input({})
  .callback(async ({ pb }) => {
    const portfolios: SchemaWithPB<{
      name: string
      holdingCount: number
      latestValue: number
    }>[] = []

    const allPortfolios = await pb.getFullList
      .collection('portfolios')
      .execute()

    for (const portfolio of allPortfolios) {
      const holdingCount = await pb.getList
        .collection('holdings')
        .filter([
          {
            field: 'portfolio',
            operator: '=',
            value: portfolio.id
          }
        ])
        .execute()

      const latestValue = await pb.getFirstListItem
        .collection('portfolio_value_histories')
        .filter([
          {
            field: 'portfolio',
            operator: '=',
            value: portfolio.id
          }
        ])
        .sort(['-date'])
        .execute()
        .catch(() => null)

      portfolios.push({
        ...portfolio,
        holdingCount: holdingCount.totalItems,
        latestValue: latestValue?.value ?? 0
      })
    }

    return portfolios
  })

export const create = forge
  .mutation()
  .description('Create a new portfolio')
  .input({
    body: z.object({
      name: z.string(),
      closingTime: z.string().transform(str => new Date(str))
    })
  })
  .callback(async ({ pb, body }) =>
    pb.create.collection('portfolios').data(body).execute()
  )

export const update = forge
  .mutation()
  .description('Update a portfolio')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: z.object({
      name: z.string(),
      closingTime: z.string().transform(str => new Date(str))
    })
  })
  .existenceCheck('query', {
    id: 'portfolios'
  })
  .callback(async ({ pb, body, query }) =>
    pb.update.collection('portfolios').id(query.id).data(body).execute()
  )

export const remove = forge
  .mutation()
  .description('Delete a portfolio')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'portfolios'
  })
  .callback(async ({ pb, query }) =>
    pb.delete.collection('portfolios').id(query.id).execute()
  )
