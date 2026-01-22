import z from 'zod'

import forge from '../forge'
import { DEFAULT_SETTINGS, type MetricConfig } from '../utils/defaults'

const scoringTierSchema = z.object({
  threshold: z.number(),
  score: z.number()
})

const cashFlowTiersSchema = z.object({
  profit_inflow: z.number(),
  profit_outflow: z.number(),
  loss_inflow: z.number(),
  loss_outflow: z.number()
})

const metricConfigSchema = z.object({
  label: z.string(),
  unit: z.enum(['%', 'x', 'pts']),
  isInverse: z.boolean().optional(),
  tiers: z.union([z.array(scoringTierSchema), cashFlowTiersSchema])
})

export const list = forge
  .query()
  .description('List all analyzer settings')
  .input({})
  .callback(async ({ pb }) => {
    const allSettingsFields = await pb.getFullList
      .collection('analyzer_settings')
      .execute()

    const missing = Object.entries(DEFAULT_SETTINGS).filter(
      ([key]) => !allSettingsFields.some(field => field.metricId === key)
    )

    for (const [key, value] of missing) {
      await pb.create
        .collection('analyzer_settings')
        .data({
          metricId: key,
          ...value
        })
        .execute()
    }

    const finalSettingsFields = await pb.getFullList
      .collection('analyzer_settings')
      .execute()

    return Object.fromEntries(
      finalSettingsFields.map(field => [
        field.metricId,
        { ...field, metricId: undefined }
      ])
    ) as Record<string, MetricConfig>
  })

export const update = forge
  .mutation()
  .description('Update analyzer settings')
  .input({
    body: z.object({
      settings: z.record(z.string(), metricConfigSchema)
    })
  })
  .callback(async ({ pb, body }) => {
    const { settings } = body

    const allSettingsFields = await pb.getFullList
      .collection('analyzer_settings')
      .execute()

    for (const [metricId, config] of Object.entries(settings)) {
      const existing = allSettingsFields.find(
        field => field.metricId === metricId
      )

      if (existing) {
        await pb.update
          .collection('analyzer_settings')
          .id(existing.id)
          .data(config)
          .execute()
      }
    }

    return { success: true }
  })

export const reset = forge
  .mutation()
  .description('Reset analyzer settings to defaults')
  .input({})
  .callback(async ({ pb }) => {
    const allSettingsFields = await pb.getFullList
      .collection('analyzer_settings')
      .execute()

    for (const [metricId, config] of Object.entries(DEFAULT_SETTINGS)) {
      const existing = allSettingsFields.find(
        field => field.metricId === metricId
      )

      if (existing) {
        await pb.update
          .collection('analyzer_settings')
          .id(existing.id)
          .data(config)
          .execute()
      }
    }

    return { success: true }
  })
