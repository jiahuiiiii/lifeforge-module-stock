import { useModuleTranslation } from '@lifeforge/localization'
import { Grid } from '@lifeforge/ui'

import TermItem from './components/TermItem'

const TERM_KEYS = [
  'cagr',
  'peRatio',
  'pegRatio',
  'dividendYield',
  'netProfitMargin',
  'roe',
  'psRatio'
] as const

const TERM_CONFIG = {
  cagr: {
    latex:
      '\\left(\\dfrac{\\text{End Value}}{\\text{Start Value}}\\right)^{\\frac{1}{n}} - 1',
    color: 'green-500' as const,
    icon: 'tabler:letter-c'
  },
  peRatio: {
    latex: '\\dfrac{\\text{Stock Price}}{\\text{EPS}}',
    color: 'blue-500' as const,
    icon: 'tabler:letter-p'
  },
  pegRatio: {
    latex: '\\dfrac{\\text{PE Ratio}}{\\text{CAGR}}',
    color: 'purple-500' as const,
    icon: 'tabler:letter-p'
  },
  dividendYield: {
    latex:
      '\\dfrac{\\text{Annual Dividend}}{\\text{Stock Price}} \\times 100\\%',
    color: 'orange-500' as const,
    icon: 'tabler:letter-d'
  },
  netProfitMargin: {
    latex: '\\dfrac{\\text{Net Profit}}{\\text{Revenue}} \\times 100\\%',
    color: 'teal-500' as const,
    icon: 'tabler:letter-n'
  },
  roe: {
    latex:
      '\\dfrac{\\text{Net Income}}{\\text{Shareholder Equity}} \\times 100\\%',
    color: 'pink-500' as const,
    icon: 'tabler:letter-r'
  },
  psRatio: {
    latex: '\\dfrac{\\text{Market Cap}}{\\text{Total Revenue}}',
    color: 'indigo-500' as const,
    icon: 'tabler:letter-p'
  }
}

function GlossaryTab() {
  const { t } = useModuleTranslation()

  return (
    <Grid gap="md" templateCols={{ base: 1, md: 2 }}>
      {TERM_KEYS.map(key => (
        <TermItem
          key={key}
          color={TERM_CONFIG[key].color}
          description={t(`guide.glossary.${key}.description`)}
          icon={TERM_CONFIG[key].icon}
          latex={TERM_CONFIG[key].latex}
          term={t(`guide.glossary.${key}.fullName`)}
        />
      ))}
    </Grid>
  )
}

export default GlossaryTab
