import 'katex/dist/katex.min.css'
import { ModuleHeader, Tabs } from 'lifeforge-ui'
import { useState } from 'react'

import PhilosophyTab from './tabs/01_Philosophy'
import GlossaryTab from './tabs/02_Glossaries'
import HowToTab from './tabs/03_HowTo'
import LimitationsTab from './tabs/04_Limitation'

const TABS = {
  philosophy: {
    name: 'Philosophy',
    icon: 'tabler:bulb',
    component: PhilosophyTab
  },
  glossary: { name: 'Glossary', icon: 'tabler:book', component: GlossaryTab },
  howto: { name: 'How to Use', icon: 'tabler:list-check', component: HowToTab },
  limitations: {
    name: 'Limitations',
    icon: 'tabler:alert-triangle',
    component: LimitationsTab
  }
} as const

export default function Guide() {
  const [activeTab, setActiveTab] = useState<keyof typeof TABS>('philosophy')

  return (
    <>
      <ModuleHeader
        icon="tabler:book"
        namespace="apps.jiahuiiiii$stock"
        title="guide"
        tKey="subsectionsTitleAndDesc"
      />
      <div className="mb-12 space-y-6">
        <Tabs
          currentTab={activeTab}
          enabled={Object.keys(TABS) as (keyof typeof TABS)[]}
          items={Object.entries(TABS).map(([key, value]) => ({
            id: key,
            name: value.name,
            icon: value.icon
          }))}
          onTabChange={setActiveTab}
        />
        {(() => {
          const TabComponent = TABS[activeTab].component

          return <TabComponent />
        })()}
      </div>
    </>
  )
}
