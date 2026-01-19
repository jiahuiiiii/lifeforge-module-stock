import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PortfolioHolding {
  id: string
  symbol: string
  name: string
  shares: number
  avgCost: number
  dateAdded: string
}

export interface ValueHistoryEntry {
  date: string
  value: number
}

export interface Portfolio {
  id: string
  name: string
  holdings: PortfolioHolding[]
  valueHistory: ValueHistoryEntry[]
  createdAt: string
}

export interface PortfolioState {
  portfolios: Portfolio[]
  activePortfolioId: string | null

  // Portfolio management
  createPortfolio: (name: string) => void
  deletePortfolio: (id: string) => void
  renamePortfolio: (id: string, name: string) => void
  setActivePortfolio: (id: string) => void

  // Holding management (operates on active portfolio)
  addHolding: (holding: Omit<PortfolioHolding, 'id'>) => void
  updateHolding: (id: string, updates: Partial<PortfolioHolding>) => void
  removeHolding: (id: string) => void
  recordValue: (value: number) => void

  // Computed helpers
  getActivePortfolio: () => Portfolio | undefined
}

// Helper to update a portfolio in the array
const updatePortfolio = (
  portfolios: Portfolio[],
  id: string,
  updater: (portfolio: Portfolio) => Portfolio
): Portfolio[] => {
  return portfolios.map(p => (p.id === id ? updater(p) : p))
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      portfolios: [],
      activePortfolioId: null,

      createPortfolio: name =>
        set(state => {
          const newPortfolio: Portfolio = {
            id: crypto.randomUUID(),
            name,
            holdings: [],
            valueHistory: [],
            createdAt: new Date().toISOString()
          }

          return {
            portfolios: [...state.portfolios, newPortfolio],
            activePortfolioId: state.activePortfolioId ?? newPortfolio.id
          }
        }),

      deletePortfolio: id =>
        set(state => {
          const newPortfolios = state.portfolios.filter(p => p.id !== id)

          // If deleted the active portfolio, switch to another
          let newActiveId = state.activePortfolioId

          if (state.activePortfolioId === id) {
            newActiveId = newPortfolios.length > 0 ? newPortfolios[0].id : null
          }

          return {
            portfolios: newPortfolios,
            activePortfolioId: newActiveId
          }
        }),

      renamePortfolio: (id, name) =>
        set(state => ({
          portfolios: updatePortfolio(state.portfolios, id, p => ({
            ...p,
            name
          }))
        })),

      setActivePortfolio: id => set({ activePortfolioId: id }),

      addHolding: holding =>
        set(state => {
          const activeId = state.activePortfolioId

          if (!activeId) return state

          return {
            portfolios: updatePortfolio(state.portfolios, activeId, p => ({
              ...p,
              holdings: [
                ...p.holdings,
                {
                  ...holding,
                  id: crypto.randomUUID(),
                  dateAdded: holding.dateAdded || new Date().toISOString()
                }
              ]
            }))
          }
        }),

      updateHolding: (id, updates) =>
        set(state => {
          const activeId = state.activePortfolioId

          if (!activeId) return state

          return {
            portfolios: updatePortfolio(state.portfolios, activeId, p => ({
              ...p,
              holdings: p.holdings.map(h =>
                h.id === id ? { ...h, ...updates } : h
              )
            }))
          }
        }),

      removeHolding: id =>
        set(state => {
          const activeId = state.activePortfolioId

          if (!activeId) return state

          return {
            portfolios: updatePortfolio(state.portfolios, activeId, p => ({
              ...p,
              holdings: p.holdings.filter(h => h.id !== id)
            }))
          }
        }),

      recordValue: value =>
        set(state => {
          const activeId = state.activePortfolioId

          if (!activeId) return state

          const today = new Date().toISOString().split('T')[0]

          return {
            portfolios: updatePortfolio(state.portfolios, activeId, p => {
              const existingIndex = p.valueHistory.findIndex(
                e => e.date === today
              )

              if (existingIndex >= 0) {
                const newHistory = [...p.valueHistory]

                newHistory[existingIndex] = { date: today, value }

                return { ...p, valueHistory: newHistory }
              }

              return {
                ...p,
                valueHistory: [...p.valueHistory, { date: today, value }]
              }
            })
          }
        }),

      getActivePortfolio: () => {
        const state = get()

        return state.portfolios.find(p => p.id === state.activePortfolioId)
      }
    }),
    {
      name: 'stock-portfolio-storage'
    }
  )
)
