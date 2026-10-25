import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router'

import type { InferOutput } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  EmptyStateScreen,
  FAB,
  GoBackButton,
  ModuleHeader,
  Stack,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
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
  const { t } = useModuleTranslation()
  const { open } = useModalStore()
  const navigate = useNavigate()
  const { portfolioId } = useParams()

  const portfolioQuery = useQuery(
    forgeAPI.portfolios.getById.input({ id: portfolioId ?? '' }).queryOptions({
      enabled: !!portfolioId
    })
  )

  const { holdingsWithPrices, isLoading: isHoldingsDataLoading } =
    useHoldingWithPrices(portfolioQuery.data?.holdings ?? [])

  function handleAddHolding() {
    open(ModifyHoldingModal, {
      openType: 'create'
    })
  }

  return (
    <>
      <GoBackButton onClick={() => navigate(-1)} />
      <WithQuery query={portfolioQuery}>
        {portfolio => (
          <>
            <ModuleHeader
              description={t('portfolio.holdingsValuing', {
                count: holdingsWithPrices.length,
                value: numberToCurrency(
                  portfolio.value_history.slice(-1)[0]?.value ?? 0
                )
              })}
              icon="tabler:briefcase"
              namespace={false}
              title={portfolio.name}
              trailing={
                <Button
                  display={{ base: 'none', md: 'flex' }}
                  icon="tabler:plus"
                  onClick={handleAddHolding}
                >
                  Add Holding
                </Button>
              }
            />
            {holdingsWithPrices.length === 0 ? (
              <EmptyStateScreen
                icon="tabler:chart-pie-off"
                message={{ id: 'holding' }}
              />
            ) : (
              <Stack gap="lg" mb="lg">
                <PortfolioSummary holdingsWithPrices={holdingsWithPrices} />
                <PerformanceChart
                  holdings={holdingsWithPrices}
                  portfolioName={portfolio.name || 'My Portfolio'}
                />
                <HoldingsTable
                  holdings={holdingsWithPrices}
                  isLoading={isHoldingsDataLoading}
                />
              </Stack>
            )}
          </>
        )}
      </WithQuery>
      <FAB onClick={handleAddHolding} />
    </>
  )
}

export default PortfolioHolding
