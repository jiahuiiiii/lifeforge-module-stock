import { Icon } from '@iconify/react'
import { Button, Card } from 'lifeforge-ui'
import { useState } from 'react'

interface SaveCalculationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (info: {
    ticker: string
    name: string
    exchange: string
    date: string
  }) => void
}

export default function SaveCalculationModal({
  isOpen,
  onClose,
  onSave
}: SaveCalculationModalProps) {
  const [ticker, setTicker] = useState('')

  const [name, setName] = useState('')

  const [exchange, setExchange] = useState('')

  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = () => {
    if (!ticker.trim()) return

    onSave({
      ticker: ticker.trim().toUpperCase(),
      name: name.trim(),
      exchange: exchange.trim(),
      date: new Date(date).toISOString()
    })

    // Reset form
    setTicker('')
    setName('')
    setExchange('')
    setDate(new Date().toISOString().split('T')[0])
    onClose()
  }

  const isValid = ticker.trim().length > 0

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-custom-500/20 flex size-12 items-center justify-center rounded-lg">
            <Icon
              className="text-custom-500 size-6"
              icon="tabler:device-floppy"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold">Save Calculation</h2>
            <p className="text-bg-500 text-sm">
              Enter stock information to save this calculation
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-bg-500 mb-1 block text-sm">
                Ticker <span className="text-red-500">*</span>
              </label>
              <input
                className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm uppercase"
                placeholder="e.g., AAPL"
                type="text"
                value={ticker}
                onChange={e => setTicker(e.target.value)}
              />
            </div>
            <div>
              <label className="text-bg-500 mb-1 block text-sm">Exchange</label>
              <input
                className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="e.g., NASDAQ"
                type="text"
                value={exchange}
                onChange={e => setExchange(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-bg-500 mb-1 block text-sm">
              Company Name
            </label>
            <input
              className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="e.g., Apple Inc."
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-bg-500 mb-1 block text-sm">Date</label>
            <input
              className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
              max={new Date().toISOString().split('T')[0]}
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button className="flex-1" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={!isValid}
            icon="tabler:device-floppy"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      </Card>
    </div>
  )
}
