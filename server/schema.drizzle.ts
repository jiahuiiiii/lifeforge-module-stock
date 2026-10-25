import { type RelationsBuilder } from 'drizzle-orm'
import {
  boolean,
  doublePrecision,
  jsonb,
  text,
  timestamp,
  uuid
} from 'drizzle-orm/pg-core'

import { createModuleTable } from '@lifeforge/drizzle'

import type { CashFlowOption, ScoringTier } from './utils/defaults'

const pgTable = createModuleTable()

export const portfolios = pgTable('portfolios', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().default(''),
  closing_time: timestamp('closing_time', { mode: 'date' })
    .defaultNow()
    .notNull()
})

export const portfolioValueHistories = pgTable('portfolio_value_histories', {
  id: uuid('id').defaultRandom().primaryKey(),
  portfolio: uuid('portfolio')
    .notNull()
    .references(() => portfolios.id, { onDelete: 'cascade' }),
  value: doublePrecision('value').notNull().default(0),
  date: timestamp('date', { mode: 'date' }).defaultNow().notNull()
})

export const holdings = pgTable('holdings', {
  id: uuid('id').defaultRandom().primaryKey(),
  symbol: text('symbol').notNull().default(''),
  name: text('name').notNull().default(''),
  shares: doublePrecision('shares').notNull().default(0),
  avg_cost: doublePrecision('avg_cost').notNull().default(0),
  date_added: timestamp('date_added', { mode: 'date' })
    .defaultNow()
    .notNull(),
  portfolio: uuid('portfolio')
    .notNull()
    .references(() => portfolios.id, { onDelete: 'cascade' })
})

export const diaryEntries = pgTable('diary_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  date: timestamp('date', { mode: 'date' }).defaultNow().notNull(),
  feel: text('feel')
    .$type<'bullish' | 'neutral' | 'bearish' | 'anxious' | 'excited'>()
    .notNull()
    .default('neutral'),
  title: text('title').notNull().default(''),
  notes: text('notes').notNull().default(''),
  image: text('image').notNull().default(''),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull(),
  updated: timestamp('updated', { mode: 'date' }).defaultNow().notNull()
})

export const analyzerSettings = pgTable('analyzer_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  metric_id: text('metric_id').notNull().unique(),
  label: text('label').notNull().default(''),
  unit: text('unit').$type<'%' | 'pts' | 'x'>().notNull().default('pts'),
  is_inverse: boolean('is_inverse').notNull().default(false),
  tiers: jsonb('tiers')
    .$type<ScoringTier[] | Record<CashFlowOption, number>>()
    .notNull()
    .default([])
})

export const calculatorLogs = pgTable('calculator_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  ticker: text('ticker').notNull().default(''),
  name: text('name').notNull().default(''),
  exchange: text('exchange').notNull().default(''),
  date: timestamp('date', { mode: 'date' }).defaultNow().notNull(),
  values_and_scores: jsonb('values_and_scores')
    .$type<Record<string, { value?: number; score: number }>>()
    .notNull()
    .default({}),
  total_score: doublePrecision('total_score').notNull().default(0)
})

export const analyzerLogs = pgTable('analyzer_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  ticker: text('ticker').notNull().default(''),
  stock_exchange: text('stock_exchange').notNull().default(''),
  company_name: text('company_name').notNull().default(''),
  date: timestamp('date', { mode: 'date' }).defaultNow().notNull(),
  values: jsonb('values')
    .$type<Record<string, number | string>>()
    .notNull()
    .default({}),
  scores: jsonb('scores')
    .$type<Record<string, number>>()
    .notNull()
    .default({}),
  quantitative: jsonb('quantitative')
    .$type<Record<string, boolean>>()
    .notNull()
    .default({})
})

export const tables = {
  portfolios,
  portfolio_value_histories: portfolioValueHistories,
  holdings,
  diary_entries: diaryEntries,
  analyzer_settings: analyzerSettings,
  calculator_logs: calculatorLogs,
  analyzer_logs: analyzerLogs
}

export const relations = (_r: RelationsBuilder<typeof tables>) => ({
  portfolios: {
    holdings: _r.many.holdings(),
    value_history: _r.many.portfolio_value_histories()
  },
  holdings: {
    portfolio_info: _r.one.portfolios({
      from: _r.holdings.portfolio,
      to: _r.portfolios.id
    })
  },
  portfolio_value_histories: {
    portfolio_info: _r.one.portfolios({
      from: _r.portfolio_value_histories.portfolio,
      to: _r.portfolios.id
    })
  }
})
