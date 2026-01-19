import { Icon } from '@iconify/react'
import {
  Button,
  ConfirmationModal,
  ModalHeader,
  ModalWrapper,
  TextInput,
  useModalStore
} from 'lifeforge-ui'
import { useMemo, useState } from 'react'

import { type Portfolio, usePortfolioStore } from '../store'

interface PortfolioSelectorProps {
  onCreateFirst?: () => void
}

export default function PortfolioSelector({
  onCreateFirst
}: PortfolioSelectorProps) {
  const { open } = useModalStore()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)

  const [newName, setNewName] = useState('')

  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(
    null
  )

  const portfolios = usePortfolioStore(s => s.portfolios)

  const activePortfolioId = usePortfolioStore(s => s.activePortfolioId)

  const createPortfolio = usePortfolioStore(s => s.createPortfolio)

  const deletePortfolio = usePortfolioStore(s => s.deletePortfolio)

  const renamePortfolio = usePortfolioStore(s => s.renamePortfolio)

  const setActivePortfolio = usePortfolioStore(s => s.setActivePortfolio)

  const activePortfolio = useMemo(
    () => portfolios.find(p => p.id === activePortfolioId),
    [portfolios, activePortfolioId]
  )

  const handleCreate = () => {
    if (newName.trim()) {
      createPortfolio(newName.trim())
      setNewName('')
      setIsCreateModalOpen(false)
      onCreateFirst?.()
    }
  }

  const handleRename = () => {
    if (editingPortfolio && newName.trim()) {
      renamePortfolio(editingPortfolio.id, newName.trim())
      setNewName('')
      setEditingPortfolio(null)
      setIsRenameModalOpen(false)
    }
  }

  const handleDelete = (portfolio: Portfolio) => {
    open(ConfirmationModal, {
      title: 'Delete Portfolio',
      description: `Are you sure you want to delete "${portfolio.name}" portfolio? This action cannot be undone.`,
      confirmationButton: 'delete',
      onConfirm: async () => {
        deletePortfolio(portfolio.id)
      }
    })
  }

  const openRenameModal = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio)
    setNewName(portfolio.name)
    setIsRenameModalOpen(true)
    setIsDropdownOpen(false)
  }

  const hasPortfolios = portfolios.length > 0

  return (
    <>
      {!hasPortfolios ? (
        <Button icon="tabler:plus" onClick={() => setIsCreateModalOpen(true)}>
          Create Portfolio
        </Button>
      ) : (
        <div className="relative">
          <button
            className="bg-bg-100 hover:bg-bg-200 dark:bg-bg-800 dark:hover:bg-bg-700 flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors"
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Icon className="size-5" icon="tabler:briefcase" />
            <span>{activePortfolio?.name ?? 'Select Portfolio'}</span>
            <Icon
              className={`size-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              icon="tabler:chevron-down"
            />
          </button>

          {isDropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />

              {/* Dropdown */}
              <div className="bg-bg-50 dark:bg-bg-800 border-bg-200 dark:border-bg-700 absolute top-full left-0 z-50 mt-2 min-w-64 rounded-lg border shadow-lg">
                <div className="p-2">
                  {portfolios.map(portfolio => (
                    <div
                      key={portfolio.id}
                      className="flex items-center gap-1 p-1"
                    >
                      <Button
                        className={`flex-1 justify-start ${
                          portfolio.id === activePortfolioId
                            ? 'bg-custom-500/10 text-custom-500'
                            : ''
                        }`}
                        icon={
                          portfolio.id === activePortfolioId
                            ? 'tabler:check'
                            : 'tabler:briefcase'
                        }
                        variant="tertiary"
                        onClick={() => {
                          setActivePortfolio(portfolio.id)
                          setIsDropdownOpen(false)
                        }}
                      >
                        <span className="font-medium">{portfolio.name}</span>
                        <span className="text-bg-500 text-sm font-normal">
                          ({portfolio.holdings.length})
                        </span>
                      </Button>

                      <Button
                        icon="tabler:pencil"
                        variant="plain"
                        onClick={e => {
                          e.stopPropagation()
                          openRenameModal(portfolio)
                        }}
                      />

                      {portfolios.length > 1 && (
                        <Button
                          dangerous
                          icon="tabler:trash"
                          variant="plain"
                          onClick={e => {
                            e.stopPropagation()
                            handleDelete(portfolio)
                            setIsDropdownOpen(false)
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-bg-200 dark:border-bg-700 border-t p-2">
                  <button
                    className="text-custom-500 hover:bg-custom-500/10 flex w-full items-center gap-2 rounded-lg px-3 py-2"
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(true)
                      setIsDropdownOpen(false)
                    }}
                  >
                    <Icon className="size-4" icon="tabler:plus" />
                    <span>New Portfolio</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Create Modal */}
      <ModalWrapper isOpen={isCreateModalOpen} minWidth="400px">
        <ModalHeader
          icon="tabler:briefcase-plus"
          title="Create Portfolio"
          onClose={() => {
            setIsCreateModalOpen(false)
            setNewName('')
          }}
        />
        <div className="space-y-4 p-4">
          <TextInput
            icon="tabler:briefcase"
            label="Portfolio Name"
            placeholder="e.g., Growth Stocks"
            value={newName}
            onChange={setNewName}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false)
                setNewName('')
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={!newName.trim()}
              icon="tabler:check"
              onClick={handleCreate}
            >
              Create
            </Button>
          </div>
        </div>
      </ModalWrapper>

      {/* Rename Modal */}
      <ModalWrapper isOpen={isRenameModalOpen} minWidth="400px">
        <ModalHeader
          icon="tabler:pencil"
          title="Rename Portfolio"
          onClose={() => {
            setIsRenameModalOpen(false)
            setNewName('')
            setEditingPortfolio(null)
          }}
        />
        <div className="space-y-4 p-4">
          <TextInput
            icon="tabler:briefcase"
            label="Portfolio Name"
            placeholder="e.g., Growth Stocks"
            value={newName}
            onChange={setNewName}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setIsRenameModalOpen(false)
                setNewName('')
                setEditingPortfolio(null)
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={!newName.trim()}
              icon="tabler:check"
              onClick={handleRename}
            >
              Rename
            </Button>
          </div>
        </div>
      </ModalWrapper>
    </>
  )
}
