import { ModuleHeader, Tabs } from 'lifeforge-ui'
import { useState } from 'react'

import AnalysisItem from './components/AnalysisItem'
import CalculatorItem from './components/CalculatorItem'
import ItemListing from './components/ItemListing'
import { useAnalyzerStore } from './store'

export default function Logbook() {
  const logs = useAnalyzerStore(s => s.logs)

  const calculatorLogs = useAnalyzerStore(s => s.calculatorLogs)

  const tabs = {
    analyses: {
      name: 'Stock Analyses',
      icon: 'tabler:chart-line',
      component: AnalysisItem,
      logs
    },
    calculators: {
      name: 'Calculations',
      icon: 'tabler:calculator',
      component: CalculatorItem,
      logs: calculatorLogs
    }
  }

  const [activeTab, setActiveTab] = useState<keyof typeof tabs>('analyses')

  return (
    <>
      <ModuleHeader
        icon="tabler:book"
        namespace="apps.jiahuiiiii$stock"
        title="logbook"
        tKey="subsectionsTitleAndDesc"
      />
      <Tabs
        className="mb-4"
        currentTab={activeTab}
        enabled={Object.keys(tabs) as (keyof typeof tabs)[]}
        items={Object.entries(tabs).map(([id, { name, icon, logs }]) => ({
          id,
          name,
          icon,
          amount: logs.length
        }))}
        onTabChange={setActiveTab}
      />
      <ItemListing
        component={tabs[activeTab].component}
        logs={tabs[activeTab].logs}
      />
    </>
  )
}
