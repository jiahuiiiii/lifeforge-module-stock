import {
  Button,
  EmptyStateScreen,
  FAB,
  Flex,
  ModuleHeader,
  Stack,
  WithQueryData,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import ModifyPortfolioModal from './components/ModifyPortfolioModal'
import PortfolioItem from './components/PortfolioItem'

export type Holding = {
  symbol: string
  name: string
  shares: number
  avg_cost: number
  date_added: string
}

function Portfolio() {
  const { open } = useModalStore()

  function handleCreate() {
    open(ModifyPortfolioModal, {
      openType: 'create'
    })
  }

  return (
    <Flex direction="column" flex="1" width="100%">
      <ModuleHeader
        icon="tabler:briefcase"
        title="portfolio"
        trailing={
          <Button
            display={{ base: 'none', md: 'flex' }}
            icon="tabler:plus"
            onClick={handleCreate}
          >
            Create Portfolio
          </Button>
        }
      />
      <WithQueryData contract={forgeAPI.portfolios.list}>
        {portfolios =>
          portfolios.length > 0 ? (
            <Stack gap="md">
              {portfolios.map(portfolio => (
                <PortfolioItem key={portfolio.id} portfolio={portfolio} />
              ))}
            </Stack>
          ) : (
            <EmptyStateScreen
              icon="tabler:briefcase"
              message={{ id: 'portfolio' }}
            />
          )
        }
      </WithQueryData>
      <FAB onClick={handleCreate} />
    </Flex>
  )
}

export default Portfolio
