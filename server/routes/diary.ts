import { eq } from 'drizzle-orm'
import z from 'zod'

import forge from '../forge'
import { diaryEntries } from '../schema.drizzle'

const diaryEntryDto = z.object({
  id: z.string(),
  date: z.date(),
  feel: z.enum(['bullish', 'neutral', 'bearish', 'anxious', 'excited']),
  title: z.string(),
  notes: z.string(),
  image: z.string(),
  created: z.date(),
  updated: z.date()
})

const diaryEntryInputDto = z.object({
  date: z.string(),
  feel: z.enum(['bullish', 'neutral', 'bearish', 'anxious', 'excited']),
  title: z.string(),
  notes: z.string()
})

export const list = forge
  .query({
    description: 'List diary entries, newest first.',
    output: {
      OK: z.array(diaryEntryDto)
    }
  })
  .callback(async ({ db, response }) =>
    response.ok(
      await db.query.diary_entries.findMany({
        orderBy: { date: 'desc' }
      })
    )
  )

export const create = forge
  .mutation({
    description: 'Create a new diary entry.',
    input: {
      body: diaryEntryInputDto
    },
    media: {
      image: {
        optional: true
      }
    },
    output: {
      CREATED: diaryEntryDto
    }
  })
  .callback(
    async ({ db, body, media: { image }, core: { storage }, response }) => {
      const imageRef = await storage.save({
        file: typeof image === 'object' ? image : undefined,
        thumbs: ['256x0']
      })

      const [created] = await db
        .insert(diaryEntries)
        .values({
          date: new Date(body.date),
          feel: body.feel,
          title: body.title,
          notes: body.notes,
          image: imageRef?.key ?? ''
        })
        .returning()

      return response.created(created!)
    }
  )

export const update = forge
  .mutation({
    description: 'Update a diary entry.',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), diaryEntries)
      }),
      body: diaryEntryInputDto
    },
    media: {
      image: {
        optional: true
      }
    },
    output: {
      OK: diaryEntryDto
    }
  })
  .callback(async ({ db, body, query: { id }, media: { image }, core: { storage }, response }) => {
    const existing = await db.query.diary_entries.findFirst({
      where: { id }
    })

    const imageRef = await storage.save({
      file:
        image === 'keep' || image === 'removed'
          ? image
          : typeof image === 'object'
            ? image
            : undefined,
      currentKey: existing?.image || undefined,
      thumbs: ['256x0']
    })

    const [updated] = await db
      .update(diaryEntries)
      .set({
        date: new Date(body.date),
        feel: body.feel,
        title: body.title,
        notes: body.notes,
        image: imageRef?.key ?? '',
        updated: new Date()
      })
      .where(eq(diaryEntries.id, id))
      .returning()

    return response.ok(updated!)
  })

export const remove = forge
  .mutation({
    description: 'Remove a diary entry.',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), diaryEntries)
      })
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ db, query: { id }, core: { storage }, response }) => {
    const existing = await db.query.diary_entries.findFirst({
      where: { id }
    })

    await db.delete(diaryEntries).where(eq(diaryEntries.id, id))

    if (existing?.image) {
      await storage.delete(existing.image)
    }

    return response.noContent()
  })
