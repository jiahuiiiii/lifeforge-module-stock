import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  routes: {
    '/': lazy(() => import('@/pages/Dashboard')),
    '/watchlist': lazy(() => import('@/pages/Watchlist')),
    '/portfolio': lazy(() => import('@/pages/Portfolio')),
    '/portfolio/:portfolioId': lazy(() => import('@/pages/PortfolioHolding')),
    '/diary': lazy(() => import('@/pages/Diary')),
    '/chart/:symbolAndName': lazy(() => import('@/pages/StockChart')),
    '/analyzer/toolbox': lazy(() => import('@/pages/Toolbox')),
    '/analyzer/gdp-prc': lazy(() => import('@/pages/Analyzer/GdpPrc')),
    '/analyzer/logbook': lazy(() => import('@/pages/AnalyzerLogbook')),
    '/analyzer/settings': lazy(() => import('@/pages/Analyzer/Settings')),
    '/analyzer/guide': lazy(() => import('@/pages/Analyzer/Guide'))
  },
  subsection: [
    { label: 'Dashboard', icon: 'tabler:dashboard', path: '' },
    { label: 'Watchlist', icon: 'tabler:eye', path: 'watchlist' },
    { label: 'Portfolio', icon: 'tabler:chart-line', path: 'portfolio' },
    { label: 'Diary', icon: 'tabler:notebook', path: 'diary' },
    {
      label: 'Calculators',
      icon: 'tabler:calculator',
      path: 'analyzer/toolbox'
    },
    {
      label: 'Analyzer',
      icon: 'tabler:chart-arrows',
      path: 'analyzer/gdp-prc'
    },
    { label: 'Logbook', icon: 'tabler:book', path: 'analyzer/logbook' },
    { label: 'Settings', icon: 'tabler:settings', path: 'analyzer/settings' },
    { label: 'Guide', icon: 'tabler:bulb', path: 'analyzer/guide' }
  ]
} satisfies ModuleConfig
