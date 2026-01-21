import {
  Button,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  WithQueryData,
  useModalStore
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import forgeAPI from '@/utils/forgeAPI'

import ModifyPortfolioModal from './components/ModifyPortfolioModal'
import PortfolioItem from './components/PortfolioItem'

export type Holding = {
  symbol: string
  name: string
  shares: number
  avgCost: number
  dateAdded: string
}

export default function Portfolio() {
  const { t } = useTranslation('apps.jiahuiiiii$stock')

  const { open } = useModalStore()

  const handleCreate = () => {
    open(ModifyPortfolioModal, {
      openType: 'create'
    })
  }

  return (
    <div className="flex flex-1 animate-[fadeSlideIn_0.3s_ease-out] flex-col">
      <ModuleHeader
        actionButton={
          <Button
            className="hidden md:flex"
            icon="tabler:plus"
            namespace="apps.jiahuiiiii$stock"
            onClick={handleCreate}
          >
            Create Portfolio
          </Button>
        }
        icon="tabler:briefcase"
        namespace="apps.jiahuiiiii$stock"
        title="portfolio"
        tKey="subsectionsTitleAndDesc"
      />
      <WithQueryData controller={forgeAPI.portfolios.list}>
        {portfolios => (
          <>
            {portfolios.length > 0 ? (
              <div className="space-y-3">
                {portfolios.map(portfolio => (
                  <PortfolioItem key={portfolio.id} portfolio={portfolio} />
                ))}
              </div>
            ) : (
              <EmptyStateScreen
                icon="tabler:briefcase"
                message={{
                  id: 'portfolio',
                  namespace: 'apps.jiahuiiiii$stock'
                }}
              />
            )}
          </>
        )}
      </WithQueryData>
      <FAB onClick={handleCreate} />
    </div>
  )
}
