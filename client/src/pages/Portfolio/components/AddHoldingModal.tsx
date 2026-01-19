import { Icon } from '@iconify/react'
import { Button, Card } from 'lifeforge-ui'
import { useState } from 'react'

interface AddHoldingModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (holding: {
    symbol: string
    name: string
    shares: number
    avgCost: number
    dateAdded: string
  }) => void
}

export default function AddHoldingModal({
  isOpen,
  onClose,
  onAdd
}: AddHoldingModalProps) {
  const [symbol, setSymbol] = useState('')

  const [name, setName] = useState('')

  const [shares, setShares] = useState('')

  const [avgCost, setAvgCost] = useState('')

  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = () => {
    const sharesNum = parseFloat(shares)

    const avgCostNum = parseFloat(avgCost)

    if (!symbol.trim() || sharesNum <= 0 || avgCostNum <= 0) {
      return
    }

    onAdd({
      symbol: symbol.toUpperCase().trim(),
      name: name.trim() || symbol.toUpperCase().trim(),
      shares: sharesNum,
      avgCost: avgCostNum,
      dateAdded: new Date(date).toISOString()
    })

    // Reset form
    setSymbol('')
    setName('')
    setShares('')
    setAvgCost('')
    setDate(new Date().toISOString().split('T')[0])
    onClose()
  }

  const isValid =
    symbol.trim() && parseFloat(shares) > 0 && parseFloat(avgCost) > 0 && date

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-custom-500/20 flex size-12 items-center justify-center rounded-lg">
            <Icon className="text-custom-500 size-6" icon="tabler:plus" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Add Holding</h2>
            <p className="text-bg-500 text-sm">Add a stock to your portfolio</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-bg-500 mb-1 block text-sm">
              Stock Symbol
            </label>
            <input
              className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="e.g., AAPL"
              value={symbol}
              onChange={e => setSymbol(e.target.value)}
            />
          </div>

          <div>
            <label className="text-bg-500 mb-1 block text-sm">
              Company Name (optional)
            </label>
            <input
              className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="e.g., Apple Inc."
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

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
            icon="tabler:plus"
            onClick={handleSubmit}
          >
            Add Holding
          </Button>
        </div>
      </Card>
    </div>
  )
}
