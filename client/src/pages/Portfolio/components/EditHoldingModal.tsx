import { Icon } from '@iconify/react'
import { Button, Card } from 'lifeforge-ui'
import { useEffect, useState } from 'react'

import type { PortfolioHolding } from '../store'

interface EditHoldingModalProps {
  isOpen: boolean
  holding: PortfolioHolding | null
  onClose: () => void
  onSave: (id: string, updates: Partial<PortfolioHolding>) => void
}

export default function EditHoldingModal({
  isOpen,
  holding,
  onClose,
  onSave
}: EditHoldingModalProps) {
  const [shares, setShares] = useState('')

  const [avgCost, setAvgCost] = useState('')

  const [date, setDate] = useState('')

  // Populate form when holding changes
  useEffect(() => {
    if (holding) {
      setShares(holding.shares.toString())
      setAvgCost(holding.avgCost.toString())
      setDate(holding.dateAdded.split('T')[0])
    }
  }, [holding])

  const handleSubmit = () => {
    if (!holding) return

    const sharesNum = parseFloat(shares)

    const avgCostNum = parseFloat(avgCost)

    if (sharesNum <= 0 || avgCostNum <= 0) {
      return
    }

    onSave(holding.id, {
      shares: sharesNum,
      avgCost: avgCostNum,
      dateAdded: new Date(date).toISOString()
    })

    onClose()
  }

  const isValid = parseFloat(shares) > 0 && parseFloat(avgCost) > 0 && date

  if (!isOpen || !holding) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-custom-500/20 flex size-12 items-center justify-center rounded-lg">
            <Icon className="text-custom-500 size-6" icon="tabler:edit" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Edit Holding</h2>
            <p className="text-bg-500 text-sm">
              {holding.symbol} - {holding.name}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-bg-500 mb-1 block text-sm">Date Added</label>
            <input
              className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
              max={new Date().toISOString().split('T')[0]}
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-bg-500 mb-1 block text-sm">
                Number of Shares
              </label>
              <input
                className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
                min="0.0001"
                placeholder="e.g., 100"
                step="0.0001"
                type="number"
                value={shares}
                onChange={e => setShares(e.target.value)}
              />
            </div>
            <div>
              <label className="text-bg-500 mb-1 block text-sm">
                Avg Cost per Share
              </label>
              <input
                className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
                min="0.01"
                placeholder="e.g., 150.00"
                step="0.01"
                type="number"
                value={avgCost}
                onChange={e => setAvgCost(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button className="flex-1" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={!isValid}
            icon="tabler:check"
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  )
}
