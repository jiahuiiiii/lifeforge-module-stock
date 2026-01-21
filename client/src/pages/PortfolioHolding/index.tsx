import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import { Button, EmptyStateScreen, GoBackButton, WithQuery } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { type InferOutput, useModalStore, useNavigate, useParams } from 'shared'

import forgeAPI from '@/utils/forgeAPI'
import numberToCurrency from '@/utils/numberToCurrency'

import HoldingsTable from './components/HoldingsTable'
import ModifyHoldingModal from './components/ModifyHoldingModal'
import PerformanceChart from './components/PerformanceChart'
import PortfolioSummary from './components/PortfolioSummary'
import useHoldingWithPrices from './hooks/useHoldingWithPrices'

export type HoldingEntry = InferOutput<
  typeof forgeAPI.portfolios.getById
>['holdings'][number]

function PortfolioHolding() {
  const { t } = useTranslation('apps.jiahuiiiii$stock')

  const { open } = useModalStore()

  const navigate = useNavigate()

  const { portfolioId } = useParams()

  const portfolioQuery = useQuery(
    forgeAPI.portfolios.getById.input({ id: portfolioId! }).queryOptions({
      enabled: !!portfolioId
    })
  )

  const { holdingsWithPrices, isLoading: isHoldingsDataLoading } =
    useHoldingWithPrices(portfolioQuery.data?.holdings ?? [])

  return (
    <>
      <GoBackButton onClick={() => navigate(-1)} />
      <div className="flex-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex-center bg-custom-500/10 size-14 rounded-lg">
            <Icon className="text-custom-500 size-7" icon="tabler:briefcase" />
          </div>
          <div>
            <p className="text-xl font-medium">{portfolioQuery.data?.name}</p>
            <p className="text-bg-500">
              {t('portfolio.holdingsValuing', {
                count: holdingsWithPrices.length,
                value: numberToCurrency(
                  portfolioQuery.data?.valueHistory?.slice(-1)?.[0]?.value || 0
                )
              })}
            </p>
          </div>
        </div>
        <Button
          icon="tabler:plus"
          namespace="apps.jiahuiiiii$stock"
          onClick={() =>
            open(ModifyHoldingModal, {
              openType: 'create'
            })
          }
        >
          Add Holding
        </Button>
      </div>
      <WithQuery query={portfolioQuery}>
        {portfolio => (
          <>
            {holdingsWithPrices.length === 0 ? (
              <EmptyStateScreen
                icon="tabler:chart-pie-off"
                message={{
                  id: 'holding',
                  namespace: 'apps.jiahuiiiii$stock'
                }}
              />
            ) : (
              <div className="space-y-6">
                <PortfolioSummary holdingsWithPrices={holdingsWithPrices} />
                <PerformanceChart
                  holdings={holdingsWithPrices}
                  portfolioName={portfolio?.name ?? 'My Portfolio'}
                />
                <HoldingsTable
                  holdings={holdingsWithPrices}
                  isLoading={isHoldingsDataLoading}
                />
              </div>
            )}
          </>
        )}
      </WithQuery>
    </>
  )
}

export default PortfolioHolding
