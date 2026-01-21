import z from 'zod'

import forge from '../forge'
import schema from '../schema'

export const create = forge
  .mutation()
  .description('Create a new holding entry for a portfolio')
  .input({
    query: z.object({
      portfolioId: z.string()
    }),
    body: schema.holdings.omit({
      portfolio: true
    })
  })
  .callback(({ pb, body, query: { portfolioId } }) =>
    pb.create
      .collection('holdings')
      .data({
        ...body,
        portfolio: portfolioId
      })
      .execute()
  )

export const update = forge
  .mutation()
  .description('Update a holding entry for a portfolio')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: schema.holdings.pick({
      shares: true,
      avgCost: true,
      dateAdded: true
    })
  })
  .existenceCheck('query', {
    id: 'holdings'
  })
  .callback(({ pb, body, query: { id } }) =>
    pb.update.collection('holdings').id(id).data(body).execute()
  )

export const remove = forge
  .mutation()
  .description('Remove a holding entry for a portfolio')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'holdings'
  })
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('holdings').id(id).execute()
  )
