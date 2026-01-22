import { Icon } from '@iconify/react'
import { Widget } from 'lifeforge-ui'
import COLORS from 'tailwindcss/colors'

function FindingData() {
  return (
    <Widget
      icon="tabler:search"
      iconColor={COLORS.green[500]}
      title="Finding Financial Data"
    >
      <p className="text-bg-500">
        To use this analyzer effectively, you need access to company financial
        statements. Here&apos;s where to find them:
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-bg-100 dark:bg-bg-800/50 rounded-lg p-4">
          <h3 className="mb-2 text-lg font-semibold">Annual Reports</h3>
          <p className="text-bg-500 mb-2">
            Visit the company&apos;s Investor Relations page. Key sections:
          </p>
          <ul className="text-bg-500 space-y-1">
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
          <h3 className="mb-2 text-lg font-semibold">Data Providers</h3>
          <ul className="text-bg-500 space-y-2">
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
    </Widget>
  )
}

export default FindingData
