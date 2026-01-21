import { Card } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import type { HoldingEntry } from '..'
import HoldingtableRow from './HoldingtableRow'

export interface HoldingWithPrice extends HoldingEntry {
  currentPrice: number
  change: number
  changePercent: number
}

export default function HoldingsTable({
  holdings,
  isLoading
}: {
  holdings: HoldingWithPrice[]
  isLoading: boolean
}) {
  const { t } = useTranslation('apps.jiahuiiiii$stock')

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-bg-200 bg-bg-100 dark:border-bg-700 dark:bg-bg-800 border-b">
            <tr>
              <th className="px-4 py-3 font-semibold">{t('table.symbol')}</th>
              <th className="px-4 py-3 font-semibold">{t('table.addedOn')}</th>
              <th className="px-4 py-3 text-right font-semibold">
                {t('table.shares')}
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                {t('table.avgCost')}
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                {t('table.currentPrice')}
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                {t('table.marketValue')}
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                {t('table.pl')}
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                {t('table.plPercent')}
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                {t('table.actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {holdings.map(holding => (
              <HoldingtableRow
                key={holding.id}
                holding={holding}
                isLoading={isLoading}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
