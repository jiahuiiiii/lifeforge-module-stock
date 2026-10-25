import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { ModuleHeader, Tabs, WithQuery } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import AnalysisItem from './components/AnalysisItem'
import CalculatorItem from './components/CalculatorItem'
import ItemListing from './components/ItemListing'

const TAB_KEYS = ['analyses', 'calculators'] as const

const TAB_CONFIG = {
  analyses: {
    icon: 'tabler:chart-line',
    component: AnalysisItem,
    emptyStateId: 'savedAnalysisLog'
  },
  calculators: {
    icon: 'tabler:calculator',
    component: CalculatorItem,
    emptyStateId: 'savedCalculatorLogs'
  }
}

export default function Logbook() {
  const { t } = useModuleTranslation()

  const calculatorLogsQuery = useQuery(
    forgeAPI.analyzer.logs.calculator.list.queryOptions()
  )

  const analyzerLogsQuery = useQuery(
    forgeAPI.analyzer.logs.analyzer.list.queryOptions()
  )

  const queries = {
    analyses: analyzerLogsQuery,
    calculators: calculatorLogsQuery
  }

  const [activeTab, setActiveTab] =
    useState<(typeof TAB_KEYS)[number]>('calculators')

  return (
    <>
      <ModuleHeader icon="tabler:book" title="logbook" />
      <Tabs
        currentTab={activeTab}
        enabled={[...TAB_KEYS]}
        items={TAB_KEYS.map(key => ({
          id: key,
          name: t(`logbook.tabs.${key}`),
          icon: TAB_CONFIG[key].icon,
          amount: queries[key].data?.length
        }))}
        mb="md"
        onTabChange={setActiveTab}
      />
      {activeTab === 'analyses' ? (
        <WithQuery query={analyzerLogsQuery}>
          {logs => (
            <ItemListing
              component={AnalysisItem}
              emptyStateId={TAB_CONFIG.analyses.emptyStateId}
              logs={logs}
            />
          )}
        </WithQuery>
      ) : (
        <WithQuery query={calculatorLogsQuery}>
          {logs => (
            <ItemListing
              component={CalculatorItem}
              emptyStateId={TAB_CONFIG.calculators.emptyStateId}
              logs={logs}
            />
          )}
        </WithQuery>
      )}
    </>
  )
}
