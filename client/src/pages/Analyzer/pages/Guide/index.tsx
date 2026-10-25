import 'katex/dist/katex.min.css'
import { useState } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { ModuleHeader, Stack, Tabs } from '@lifeforge/ui'

import PhilosophyTab from './tabs/01_Philosophy'
import GlossaryTab from './tabs/02_Glossaries'
import HowToTab from './tabs/03_HowTo'
import LimitationsTab from './tabs/04_Limitation'

const TAB_KEYS = ['philosophy', 'glossary', 'howto', 'limitations'] as const

const TAB_COMPONENTS = {
  philosophy: { icon: 'tabler:bulb', component: PhilosophyTab },
  glossary: { icon: 'tabler:book', component: GlossaryTab },
  howto: { icon: 'tabler:list-check', component: HowToTab },
  limitations: { icon: 'tabler:alert-triangle', component: LimitationsTab }
}

export default function Guide() {
  const { t } = useModuleTranslation()

  const [activeTab, setActiveTab] =
    useState<(typeof TAB_KEYS)[number]>('philosophy')

  const ActiveTab = TAB_COMPONENTS[activeTab].component

  return (
    <>
      <ModuleHeader icon="tabler:book" title="guide" />
      <Stack gap="lg" mb="2xl">
        <Tabs
          currentTab={activeTab}
          enabled={[...TAB_KEYS]}
          items={TAB_KEYS.map(key => ({
            id: key,
            name: t(`guide.tabs.${key}`),
            icon: TAB_COMPONENTS[key].icon
          }))}
          onTabChange={setActiveTab}
        />
        <ActiveTab />
      </Stack>
    </>
  )
}
