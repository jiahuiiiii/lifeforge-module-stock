import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Mood = 'bullish' | 'neutral' | 'bearish' | 'excited' | 'anxious'

export interface DiaryEntry {
  id: string
  date: string
  mood: Mood
  title: string
  content: string
  portfolioSnapshot?: {
    totalValue: number
    dailyChange: number
    dailyChangePercent: number
  }
  imageDataUrl?: string // Base64 encoded image
  createdAt: string
  updatedAt: string
}

export interface DiaryState {
  entries: DiaryEntry[]
  addEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateEntry: (id: string, updates: Partial<DiaryEntry>) => void
  deleteEntry: (id: string) => void
}

export const useDiaryStore = create<DiaryState>()(
  persist(
    set => ({
      entries: [],

      addEntry: entry =>
        set(state => ({
          entries: [
            {
              ...entry,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            ...state.entries
          ]
        })),

      updateEntry: (id, updates) =>
        set(state => ({
          entries: state.entries.map(e =>
            e.id === id
              ? { ...e, ...updates, updatedAt: new Date().toISOString() }
              : e
          )
        })),

      deleteEntry: id =>
        set(state => ({
          entries: state.entries.filter(e => e.id !== id)
        }))
    }),
    {
      name: 'stock-diary-storage'
    }
  )
)

export const MOOD_CONFIG: Record<
  Mood,
  { icon: string; label: string; color: string; bgColor: string }
> = {
  bullish: {
    icon: 'tabler:trending-up',
    label: 'Bullish',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  neutral: {
    icon: 'tabler:minus',
    label: 'Neutral',
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10'
  },
  bearish: {
    icon: 'tabler:trending-down',
    label: 'Bearish',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10'
  },
  excited: {
    icon: 'tabler:flame',
    label: 'Excited',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
  anxious: {
    icon: 'tabler:alert-triangle',
    label: 'Anxious',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  }
}
