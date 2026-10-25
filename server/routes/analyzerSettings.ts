import z from 'zod'

import forge from '../forge'
import { analyzerSettings } from '../schema.drizzle'
import { DEFAULT_SETTINGS, type MetricConfig } from '../utils/defaults'

const scoringTierDto = z.object({
  threshold: z.number(),
  score: z.number()
})

const cashFlowTiersDto = z.object({
  profit_inflow: z.number(),
  profit_outflow: z.number(),
  loss_inflow: z.number(),
  loss_outflow: z.number()
})

const metricConfigDto = z.object({
  label: z.string(),
  unit: z.enum(['%', 'x', 'pts']),
  is_inverse: z.boolean(),
  tiers: z.union([z.array(scoringTierDto), cashFlowTiersDto])
})

function toRow(metricId: string, config: MetricConfig) {
  return {
    metric_id: metricId,
    label: config.label,
    unit: config.unit,
    is_inverse: config.isInverse ?? false,
    tiers: config.tiers
  }
}

function toConfig(row: {
  label: string
  unit: '%' | 'x' | 'pts'
  is_inverse: boolean
  tiers: MetricConfig['tiers']
}): MetricConfig {
  return {
    label: row.label,
    unit: row.unit,
    isInverse: row.is_inverse,
    tiers: row.tiers
  }
}

export const list = forge
  .query({
    description: 'List all analyzer scoring settings.',
    output: {
      OK: z.record(z.string(), metricConfigDto)
    }
  })
  .callback(async ({ db, response }) => {
    const existing = await db.query.analyzer_settings.findMany()

    const existingIds = new Set(existing.map(row => row.metric_id))

    const missing = Object.entries(DEFAULT_SETTINGS).filter(
      ([metricId]) => !existingIds.has(metricId)
    )

    if (missing.length > 0) {
      await db
        .insert(analyzerSettings)
        .values(missing.map(([metricId, config]) => toRow(metricId, config)))
    }

    const rows = await db.query.analyzer_settings.findMany()

    return response.ok(
      Object.fromEntries(
        rows.map(row => [
          row.metric_id,
          {
            label: row.label,
            unit: row.unit,
            is_inverse: row.is_inverse,
            tiers: row.tiers
          }
        ])
      )
    )
  })

export const update = forge
  .mutation({
    description: 'Update analyzer scoring settings.',
    input: {
      body: z.object({
        settings: z.record(z.string(), metricConfigDto)
      })
    },
    output: {
      OK: z.object({
        updated: z.number()
      })
    }
  })
  .callback(async ({ db, body, response }) => {
    for (const [metricId, config] of Object.entries(body.settings)) {
      await db
        .insert(analyzerSettings)
        .values(toRow(metricId, toConfig(config)))
        .onConflictDoUpdate({
          target: analyzerSettings.metric_id,
          set: {
            label: config.label,
            unit: config.unit,
            is_inverse: config.is_inverse,
            tiers: config.tiers
          }
        })
    }

    return response.ok({ updated: Object.keys(body.settings).length })
  })

export const reset = forge
  .mutation({
    description: 'Reset analyzer scoring settings to defaults.',
    output: {
      OK: z.object({
        reset: z.number()
      })
    }
  })
  .callback(async ({ db, response }) => {
    for (const [metricId, config] of Object.entries(DEFAULT_SETTINGS)) {
      const row = toRow(metricId, config)

      await db
        .insert(analyzerSettings)
        .values(row)
        .onConflictDoUpdate({
          target: analyzerSettings.metric_id,
          set: {
            label: row.label,
            unit: row.unit,
            is_inverse: row.is_inverse,
            tiers: row.tiers
          }
        })
    }

    return response.ok({ reset: Object.keys(DEFAULT_SETTINGS).length })
  })
