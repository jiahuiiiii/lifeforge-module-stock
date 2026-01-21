import z from 'zod'

import forge from '../forge'
import schema from '../schema'

export const list = forge
  .query()
  .description('List diary entries')
  .input({})
  .callback(({ pb }) => pb.getFullList.collection('diary_entries').execute())

export const create = forge
  .mutation()
  .description('Create a new diary entry')
  .input({
    body: schema.diary_entries.omit({
      image: true
    })
  })
  .media({
    image: {
      optional: true
    }
  })
  .callback(async ({ pb, body, core: { media }, media: { image } }) =>
    pb.create
      .collection('diary_entries')
      .data({ ...body, ...(await media.retrieveMedia('image', image)) })
      .execute()
  )

export const update = forge
  .mutation()
  .description('Update a diary entry')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: schema.diary_entries.omit({
      image: true
    })
  })
  .media({
    image: {
      optional: true
    }
  })
  .existenceCheck('query', {
    id: 'diary_entries'
  })
  .callback(
    async ({ pb, body, query: { id }, core: { media }, media: { image } }) =>
      pb.update
        .collection('diary_entries')
        .id(id)
        .data({
          ...body,
          ...(await media.retrieveMedia('image', image))
        })
        .execute()
  )

export const remove = forge
  .mutation()
  .description('Remove a diary entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'diary_entries'
  })
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('diary_entries').id(id).execute()
  )
