import { Icon } from '@iconify/react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { Card, ModuleHeader } from 'lifeforge-ui'
import { useState } from 'react'

type Tab = 'philosophy' | 'glossary' | 'howto' | 'limitations'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'philosophy', label: 'Philosophy', icon: 'tabler:bulb' },
  { id: 'glossary', label: 'Glossary', icon: 'tabler:book' },
  { id: 'howto', label: 'How to Use', icon: 'tabler:list-check' },
  { id: 'limitations', label: 'Limitations', icon: 'tabler:alert-triangle' }
]

function Formula({ latex }: { latex: string }) {
  const html = katex.renderToString(latex, {
    throwOnError: false,
    displayMode: false
  })

  return (
    <span className="inline-block" dangerouslySetInnerHTML={{ __html: html }} />
  )
}

function PhilosophyTab() {
  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
            <Icon className="size-5 text-blue-500" icon="tabler:eye" />
          </div>
          <h2 className="text-xl font-bold">The Cold Eye Philosophy</h2>
        </div>
        <p className="text-bg-500 mb-4">
          The &quot;Cold Eye&quot; approach emphasizes disciplined, emotionless
          investing based on fundamental analysis. Instead of following market
          hype or emotional decisions, investors should evaluate companies using
          quantitative metrics.
        </p>
        <div className="bg-bg-100 dark:bg-bg-800/50 space-y-3 rounded-lg p-4">
          <h3 className="font-semibold">Key Principles:</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="bg-bg-50 dark:bg-bg-900/50 rounded-lg p-3">
              <div className="text-custom-500 mb-1 font-semibold">
                GDP Score
              </div>
              <p className="text-bg-500 text-sm">
                Measures wealth creation through Growth (CAGR), Dividends, and
                Price (PE ratio)
              </p>
            </div>
            <div className="bg-bg-50 dark:bg-bg-900/50 rounded-lg p-3">
              <div className="text-custom-500 mb-1 font-semibold">
                PRC Score
              </div>
              <p className="text-bg-500 text-sm">
                Measures wealth sustainability through Profit margin, ROE, and
                Cash flow
              </p>
            </div>
            <div className="bg-bg-50 dark:bg-bg-900/50 rounded-lg p-3">
              <div className="text-custom-500 mb-1 font-semibold">
                Score &gt; 100
              </div>
              <p className="text-bg-500 text-sm">
                Minimum threshold for investment consideration (Grade A)
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
            <Icon className="size-5 text-purple-500" icon="tabler:moon" />
          </div>
          <h2 className="text-xl font-bold">The Sleep Strategy</h2>
        </div>
        <p className="text-bg-500 mb-4">
          Before analyzing any numbers, ask yourself: &quot;Can I sleep well at
          night owning this stock?&quot; This requires passing the qualitative
          gate:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: 'tabler:link',
              title: 'Value Chain',
              desc: 'Is the business model sustainable?'
            },
            {
              icon: 'tabler:coin',
              title: 'Dividend Policy',
              desc: 'Does management share profits?'
            },
            {
              icon: 'tabler:user-check',
              title: 'Management',
              desc: 'Is leadership trustworthy?'
            },
            {
              icon: 'tabler:shield',
              title: 'Moat',
              desc: 'Can competitors easily replicate this?'
            }
          ].map(item => (
            <div
              key={item.title}
              className="bg-bg-100 dark:bg-bg-800/50 flex items-start gap-3 rounded-lg p-3"
            >
              <Icon
                className="text-custom-500 mt-0.5 size-5"
                icon={item.icon}
              />
              <div>
                <div className="font-medium">{item.title}</div>
                <p className="text-bg-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10">
            <Icon className="size-5 text-orange-500" icon="tabler:scale" />
          </div>
          <h2 className="text-xl font-bold">Opportunity Cost</h2>
        </div>
        <p className="text-bg-500">
          Every investment decision has an opportunity cost. By investing in one
          stock, you forgo the returns of others. The Cold Eye method ensures
          you only invest in companies that meet high standards, reducing the
          chance of poor allocation.
        </p>
      </Card>
    </div>
  )
}

function GlossaryTab() {
  const terms = [
    {
      term: 'CAGR',
      fullName: 'Compound Annual Growth Rate',
      latex:
        '\\left(\\frac{\\text{End Value}}{\\text{Start Value}}\\right)^{\\frac{1}{n}} - 1',
      description:
        'Measures the average annual growth rate of an investment over a specified period, smoothing out volatility.',
      color: 'green'
    },
    {
      term: 'PE Ratio',
      fullName: 'Price-to-Earnings',
      latex: '\\frac{\\text{Stock Price}}{\\text{EPS}}',
      description:
        'Shows how much investors are willing to pay for each dollar of earnings. Lower is generally better.',
      color: 'blue'
    },
    {
      term: 'PEG Ratio',
      fullName: 'Price/Earnings to Growth',
      latex: '\\frac{\\text{PE Ratio}}{\\text{CAGR}}',
      description:
        'Adjusts PE for growth. A PEG ≤ 1.0 suggests the stock may be undervalued relative to its growth rate (Zulu Principle).',
      color: 'purple'
    },
    {
      term: 'Dividend Yield',
      fullName: 'Annual Dividend Return',
      latex:
        '\\frac{\\text{Annual Dividend}}{\\text{Stock Price}} \\times 100\\%',
      description:
        'The percentage return from dividends alone. Higher yields indicate better income potential.',
      color: 'orange'
    },
    {
      term: 'Net Profit Margin',
      fullName: 'Profitability Ratio',
      latex: '\\frac{\\text{Net Profit}}{\\text{Revenue}} \\times 100\\%',
      description:
        'Shows how much profit a company keeps from each dollar of revenue. Higher margins indicate better efficiency.',
      color: 'teal'
    },
    {
      term: 'ROE',
      fullName: 'Return on Equity',
      latex:
        '\\frac{\\text{Net Income}}{\\text{Shareholder Equity}} \\times 100\\%',
      description:
        'Measures how effectively a company uses shareholder capital to generate profits.',
      color: 'pink'
    },
    {
      term: 'P/S Ratio',
      fullName: 'Price-to-Sales',
      latex: '\\frac{\\text{Market Cap}}{\\text{Total Revenue}}',
      description:
        'Useful for companies with low or negative earnings. Must be combined with profit margin analysis.',
      color: 'indigo'
    }
  ]

  const colorClasses: Record<string, { bg: string; text: string }> = {
    green: { bg: 'bg-green-500/10', text: 'text-green-500' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-500' },
    teal: { bg: 'bg-teal-500/10', text: 'text-teal-500' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-500' },
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500' }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {terms.map(item => (
        <Card key={item.term} className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-10 items-center justify-center rounded-lg ${colorClasses[item.color].bg}`}
            >
              <span
                className={`text-lg font-bold ${colorClasses[item.color].text}`}
              >
                {item.term.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold">{item.term}</h3>
              <span className="text-bg-500 text-xs">{item.fullName}</span>
            </div>
          </div>
          <div className="bg-bg-100 dark:bg-bg-800/50 flex items-center justify-center rounded-lg px-4 py-3">
            <Formula latex={item.latex} />
          </div>
          <p className="text-bg-500 text-sm">{item.description}</p>
        </Card>
      ))}
    </div>
  )
}

function HowToTab() {
  const steps = [
    {
      step: 1,
      title: 'Pass the Qualitative Gate',
      desc: 'Verify the company meets all 4 criteria before proceeding',
      icon: 'tabler:checkbox'
    },
    {
      step: 2,
      title: 'Calculate 5-Year CAGR',
      desc: 'Compare net profit from 5 years ago to today',
      icon: 'tabler:trending-up'
    },
    {
      step: 3,
      title: 'Find Current Dividend Yield',
      desc: 'Annual dividend ÷ current stock price',
      icon: 'tabler:percentage'
    },
    {
      step: 4,
      title: 'Check PE Ratio',
      desc: 'Current price ÷ trailing 12-month EPS',
      icon: 'tabler:chart-bar'
    },
    {
      step: 5,
      title: 'Evaluate Profit Margin',
      desc: 'Net profit ÷ total revenue',
      icon: 'tabler:chart-pie'
    },
    {
      step: 6,
      title: 'Calculate ROE',
      desc: 'Net income ÷ shareholder equity',
      icon: 'tabler:activity'
    },
    {
      step: 7,
      title: 'Assess Cash Flow',
      desc: 'Is the company profitable? Is cash flow positive?',
      icon: 'tabler:coin'
    },
    {
      step: 8,
      title: 'Review Your Score',
      desc: 'Total should exceed 100 for Grade A',
      icon: 'tabler:star'
    }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
            <Icon className="size-5 text-green-500" icon="tabler:search" />
          </div>
          <h2 className="text-xl font-bold">Finding Financial Data</h2>
        </div>
        <p className="text-bg-500 mb-4">
          To use this analyzer effectively, you need access to company financial
          statements. Here&apos;s where to find them:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-bg-100 dark:bg-bg-800/50 rounded-lg p-4">
            <h3 className="mb-2 font-semibold">Annual Reports</h3>
            <p className="text-bg-500 mb-2 text-sm">
              Visit the company&apos;s Investor Relations page. Key sections:
            </p>
            <ul className="text-bg-500 space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <Icon className="text-custom-500 size-4" icon="tabler:check" />
                Income Statement: Net profit, revenue, EPS
              </li>
              <li className="flex items-center gap-2">
                <Icon className="text-custom-500 size-4" icon="tabler:check" />
                Balance Sheet: Shareholder equity
              </li>
              <li className="flex items-center gap-2">
                <Icon className="text-custom-500 size-4" icon="tabler:check" />
                Cash Flow Statement
              </li>
            </ul>
          </div>
          <div className="bg-bg-100 dark:bg-bg-800/50 rounded-lg p-4">
            <h3 className="mb-2 font-semibold">Data Providers</h3>
            <ul className="text-bg-500 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Icon className="size-4 text-blue-500" icon="tabler:world" />
                <strong>Yahoo Finance</strong> - Free key statistics
              </li>
              <li className="flex items-center gap-2">
                <Icon className="size-4 text-purple-500" icon="tabler:star" />
                <strong>Morningstar</strong> - Detailed analysis
              </li>
              <li className="flex items-center gap-2">
                <Icon className="size-4 text-orange-500" icon="tabler:file" />
                <strong>SEC EDGAR</strong> - Official US filings
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
            <Icon className="size-5 text-blue-500" icon="tabler:list-numbers" />
          </div>
          <h2 className="text-xl font-bold">Step-by-Step Analysis</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(item => (
            <div
              key={item.step}
              className="bg-bg-100 dark:bg-bg-800/50 rounded-lg p-3"
            >
              <div className="mb-2 flex items-center gap-2">
                <div className="bg-custom-500 flex size-6 items-center justify-center rounded-full text-xs font-bold text-white">
                  {item.step}
                </div>
                <Icon className="text-custom-500 size-4" icon={item.icon} />
              </div>
              <div className="text-sm font-medium">{item.title}</div>
              <p className="text-bg-500 mt-1 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-500/10">
            <Icon className="size-5 text-yellow-500" icon="tabler:bulb" />
          </div>
          <h2 className="text-xl font-bold">Tips for Better Analysis</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: 'tabler:calculator',
              tip: 'Use the Toolbox calculators for quick checks'
            },
            {
              icon: 'tabler:chart-dots',
              tip: 'Compare multiple companies in the same sector'
            },
            {
              icon: 'tabler:history',
              tip: 'Look at 5-10 year trends, not just current values'
            },
            {
              icon: 'tabler:zoom-check',
              tip: 'Use the Zulu Principle to filter growth stocks'
            },
            {
              icon: 'tabler:discount',
              tip: 'Check Historical PE Discount for value opportunities'
            },
            { icon: 'tabler:notebook', tip: 'Save analyses to your Logbook' }
          ].map(item => (
            <div
              key={item.tip}
              className="bg-bg-100 dark:bg-bg-800/50 flex items-center gap-3 rounded-lg p-3"
            >
              <Icon
                className="text-custom-500 size-5 shrink-0"
                icon={item.icon}
              />
              <span className="text-sm">{item.tip}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function LimitationsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10">
            <Icon
              className="size-5 text-red-500"
              icon="tabler:alert-triangle"
            />
          </div>
          <h2 className="text-xl font-bold">Blind Spots & Limitations</h2>
        </div>

        <div className="space-y-4">
          {/* Tech/Growth Unfriendliness */}
          <div className="bg-bg-100 dark:bg-bg-800/50 rounded-lg p-4">
            <h3 className="mb-2 flex items-center gap-2 font-bold text-red-500">
              <Icon className="size-5" icon="tabler:rocket-off" />
              Unfriendly to Tech & Growth Stocks
            </h3>
            <p className="text-bg-500 mb-3 text-sm">
              The current model may penalize high-growth companies unjustly:
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="bg-bg-50 dark:bg-bg-900/50 rounded p-3">
                <div className="text-sm font-semibold">Dividend Issues</div>
                <p className="text-bg-500 text-xs">
                  Great tech companies (like early Amazon or Tesla) often
                  reinvest profits instead of paying dividends, leading to low
                  scores.
                </p>
              </div>
              <div className="bg-bg-50 dark:bg-bg-900/50 rounded p-3">
                <div className="text-sm font-semibold">PE Ratio Issues</div>
                <p className="text-bg-500 text-xs">
                  Quality growth stocks often trade at PE &gt; 30x. This model
                  would give them only 5 points.
                </p>
              </div>
            </div>
            <p className="text-bg-500 mt-3 border-l-2 border-red-500 pl-2 text-xs italic">
              Result: You might miss an entire tech bull run and end up only
              with traditional sectors like Banks, Real Estate, or
              Manufacturing.
            </p>
          </div>

          {/* Lagging Indicators */}
          <div className="bg-bg-100 dark:bg-bg-800/50 rounded-lg p-4">
            <h3 className="mb-2 flex items-center gap-2 font-bold text-orange-500">
              <Icon className="size-5" icon="tabler:history" />
              Lagging Indicators
            </h3>
            <p className="text-bg-500 text-sm">
              Compounded Growth (CAGR) and ROE depend on past data. A perfect
              past score doesn&apos;t guarantee future success if an industry is
              facing disruption (e.g., film cameras vs. digital). This model
              cannot evaluate future business models.
            </p>
          </div>

          {/* Simplified Cash Flow */}
          <div className="bg-bg-100 dark:bg-bg-800/50 rounded-lg p-4">
            <h3 className="mb-2 flex items-center gap-2 font-bold text-yellow-500">
              <Icon className="size-5" icon="tabler:coins" />
              Simplified Cash Flow
            </h3>
            <p className="text-bg-500 text-sm">
              The model gives 40 points for &quot;Profit + Net Inflow&quot;.
              However, expanding companies may have negative cash flow due to
              heavy investment (R&D, factories). This isn&apos;t necessarily
              bad; it could be the calm before the explosion.
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
            <Icon className="size-5 text-blue-500" icon="tabler:users" />
          </div>
          <h2 className="text-xl font-bold">Who is this for?</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Icon className="size-5 text-green-500" icon="tabler:check" />
              <h3 className="font-bold text-green-700 dark:text-green-400">
                Suitable For
              </h3>
            </div>
            <ul className="text-bg-500 space-y-2 text-sm">
              <li>
                • Long-term holders seeking stability (&quot;Steady
                Happiness&quot;)
              </li>
              <li>• Investors who don&apos;t want to watch the market daily</li>
              <li>
                • Identifying Blue Chips or Second-liners in traditional markets
                (e.g., Bursa Malaysia)
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Icon className="size-5 text-red-500" icon="tabler:x" />
              <h3 className="font-bold text-red-700 dark:text-red-400">
                Not Suitable For
              </h3>
            </div>
            <ul className="text-bg-500 space-y-2 text-sm">
              <li>• Aggressive investors targeting Tech Giants</li>
              <li>• High-growth sectors (Artificial Intelligence, Biotech)</li>
              <li>• Short-term trading or speculation</li>
            </ul>
          </div>
        </div>

        <div className="border-bg-200 dark:border-bg-700 mt-4 border-t pt-4">
          <div className="text-bg-400 flex items-start gap-2 text-xs">
            <Icon className="mt-0.5 size-4" icon="tabler:book" />
            <div>
              <p className="font-semibold">
                Source: &quot;The Ultimate Stock Market Solution&quot;
              </p>
              <p>
                Core Philosophy: Value Investing, Defense & Offense. Growth as
                primary, Value as secondary.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function Guide() {
  const [activeTab, setActiveTab] = useState<Tab>('philosophy')

  return (
    <div className="animate-[fadeSlideIn_0.3s_ease-out]">
      <ModuleHeader title="Investment Guide" />
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="bg-bg-100 dark:bg-bg-800/50 flex gap-1 overflow-x-auto rounded-lg p-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-custom-500 text-white shadow-sm'
                  : 'text-bg-500 hover:bg-bg-200 hover:text-bg-800 dark:hover:bg-bg-700 dark:hover:text-bg-200'
              }`}
              type="button"
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="size-4" icon={tab.icon} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'philosophy' && <PhilosophyTab />}
        {activeTab === 'glossary' && <GlossaryTab />}
        {activeTab === 'howto' && <HowToTab />}
        {activeTab === 'limitations' && <LimitationsTab />}
      </div>
    </div>
  )
}
