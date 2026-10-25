import { lazy } from 'react'

import { createForgeModule } from '@lifeforge/federation'

import contract from './contract'

const { forgeAPI, ...manifest } = createForgeModule({
  routes: {
    '/': lazy(() => import('@/pages/Dashboard')),
    '/watchlist': lazy(() => import('@/pages/Watchlist')),
    '/portfolio': lazy(() => import('@/pages/Portfolio')),
    '/portfolio/:portfolioId': lazy(() => import('@/pages/PortfolioHolding')),
    '/diary': lazy(() => import('@/pages/Diary')),
    '/chart/:symbolAndName': lazy(() => import('@/pages/StockChart')),
    '/analyzer/toolbox': lazy(() => import('@/pages/Analyzer/pages/Toolbox')),
    '/analyzer/gdp-prc': lazy(
      () => import('@/pages/Analyzer/pages/Analyzer')
    ),
    '/analyzer/logbook': lazy(() => import('@/pages/Analyzer/pages/Logbook')),
    '/analyzer/settings': lazy(
      () => import('@/pages/Analyzer/pages/Settings')
    ),
    '/analyzer/guide': lazy(() => import('@/pages/Analyzer/pages/Guide'))
  },
  subsection: [
    { label: 'Dashboard', icon: 'tabler:dashboard', path: '' },
    { label: 'Watchlist', icon: 'tabler:eye', path: 'watchlist' },
    { label: 'Portfolio', icon: 'tabler:chart-line', path: 'portfolio' },
    { label: 'Diary', icon: 'tabler:notebook', path: 'diary' },
    {
      label: 'Toolbox',
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
  ],
  contract
})

export default manifest

export { forgeAPI }
