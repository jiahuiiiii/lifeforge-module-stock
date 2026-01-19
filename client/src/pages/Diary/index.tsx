import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  Button,
  Card,
  ConfirmationModal,
  ModalHeader,
  ModalWrapper,
  ModuleHeader,
  TextInput,
  useModalStore
} from 'lifeforge-ui'
import { useRef, useState } from 'react'

import { type DiaryEntry, MOOD_CONFIG, type Mood, useDiaryStore } from './store'

dayjs.extend(relativeTime)

const MOODS: Mood[] = ['bullish', 'neutral', 'bearish', 'excited', 'anxious']

function NewEntryModal({
  isOpen,
  onClose,
  editEntry
}: {
  isOpen: boolean
  onClose: () => void
  editEntry?: DiaryEntry
}) {
  const addEntry = useDiaryStore(s => s.addEntry)

  const updateEntry = useDiaryStore(s => s.updateEntry)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [date, setDate] = useState(
    editEntry?.date || new Date().toISOString().split('T')[0]
  )

  const [mood, setMood] = useState<Mood>(editEntry?.mood || 'neutral')

  const [title, setTitle] = useState(editEntry?.title || '')

  const [content, setContent] = useState(editEntry?.content || '')

  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(
    editEntry?.imageDataUrl
  )

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = event => {
        setImageDataUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (!title.trim()) return

    if (editEntry) {
      updateEntry(editEntry.id, {
        date,
        mood,
        title,
        content,
        imageDataUrl
      })
    } else {
      addEntry({
        date,
        mood,
        title,
        content,
        imageDataUrl
      })
    }
    onClose()
  }

  return (
    <ModalWrapper isOpen={isOpen}>
      <ModalHeader
        icon={editEntry ? 'tabler:pencil' : 'tabler:notebook'}
        title={editEntry ? 'Edit Entry' : 'New Diary Entry'}
        onClose={onClose}
      />
      <div className="max-h-[70vh] space-y-4 overflow-y-auto p-4">
        {/* Date */}
        <div>
          <label className="text-bg-500 mb-1 block text-sm font-medium">
            Date
          </label>
          <input
            className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        {/* Mood Selector */}
        <div>
          <label className="text-bg-500 mb-2 block text-sm font-medium">
            How are you feeling about the market?
          </label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map(m => {
              const config = MOOD_CONFIG[m]

              return (
                <button
                  key={m}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
                    mood === m
                      ? `border-current ${config.color} ${config.bgColor}`
                      : 'border-bg-200 dark:border-bg-700 hover:bg-bg-100 dark:hover:bg-bg-800'
                  }`}
                  type="button"
                  onClick={() => setMood(m)}
                >
                  <Icon className="size-4" icon={config.icon} />
                  <span className="text-sm">{config.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Title */}
        <TextInput
          icon="tabler:heading"
          label="Title"
          namespace="apps"
          placeholder="Market thoughts..."
          value={title}
          onChange={setTitle}
        />

        {/* Content */}
        <div>
          <label className="text-bg-500 mb-1 block text-sm font-medium">
            Notes
          </label>
          <textarea
            className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 min-h-[120px] w-full resize-y rounded-lg border px-3 py-2"
            placeholder="Write your thoughts about today's market, your trades, observations..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="text-bg-500 mb-2 block text-sm font-medium">
            Attach Image (optional)
          </label>
          <input
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            type="file"
            onChange={handleImageUpload}
          />
          {imageDataUrl ? (
            <div className="relative">
              <img
                alt="Diary attachment"
                className="w-full rounded-lg object-cover"
                src={imageDataUrl}
              />
              <button
                className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white"
                title="Remove image"
                type="button"
                onClick={() => setImageDataUrl(undefined)}
              >
                <Icon className="size-4" icon="tabler:x" />
              </button>
            </div>
          ) : (
            <Button
              className="w-full"
              icon="tabler:photo-plus"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Add Image
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-3 p-4 pt-0">
        <Button className="flex-1" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="flex-1"
          disabled={!title.trim()}
          icon={editEntry ? 'tabler:check' : 'tabler:plus'}
          onClick={handleSubmit}
        >
          {editEntry ? 'Save Changes' : 'Add Entry'}
        </Button>
      </div>
    </ModalWrapper>
  )
}

function EntryCard({
  entry,
  onEdit
}: {
  entry: DiaryEntry
  onEdit: () => void
}) {
  const deleteEntry = useDiaryStore(s => s.deleteEntry)

  const { open } = useModalStore()

  const moodConfig = MOOD_CONFIG[entry.mood]

  return (
    <Card className="group space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex size-10 items-center justify-center rounded-lg ${moodConfig.bgColor}`}
          >
            <Icon
              className={`size-5 ${moodConfig.color}`}
              icon={moodConfig.icon}
            />
          </div>
          <div>
            <h3 className="font-semibold">{entry.title}</h3>
            <div className="text-bg-500 flex items-center gap-2 text-xs">
              <span>{dayjs(entry.date).format('MMM D, YYYY')}</span>
              <span>•</span>
              <span className={moodConfig.color}>{moodConfig.label}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button icon="tabler:pencil" variant="plain" onClick={onEdit} />
          <Button
            dangerous
            icon="tabler:trash"
            variant="plain"
            onClick={() =>
              open(ConfirmationModal, {
                title: 'Delete Entry',
                description:
                  'Are you sure you want to delete this diary entry? This cannot be undone.',
                confirmationButton: 'delete',
                onConfirm: async () => {
                  deleteEntry(entry.id)
                }
              })
            }
          />
        </div>
      </div>

      {entry.content && (
        <p className="text-bg-500 text-sm whitespace-pre-wrap">
          {entry.content}
        </p>
      )}

      {entry.imageDataUrl && (
        <img
          alt="Diary attachment"
          className="max-h-64 w-full rounded-lg object-cover"
          src={entry.imageDataUrl}
        />
      )}

      {entry.portfolioSnapshot && (
        <div className="bg-bg-100 dark:bg-bg-800/50 flex items-center gap-4 rounded-lg px-3 py-2 text-sm">
          <div>
            <span className="text-bg-500">Portfolio:</span>{' '}
            <span className="font-semibold">
              ${entry.portfolioSnapshot.totalValue.toLocaleString()}
            </span>
          </div>
          <div
            className={
              entry.portfolioSnapshot.dailyChange >= 0
                ? 'text-green-500'
                : 'text-red-500'
            }
          >
            {entry.portfolioSnapshot.dailyChange >= 0 ? '+' : ''}
            {entry.portfolioSnapshot.dailyChangePercent.toFixed(2)}%
          </div>
        </div>
      )}
    </Card>
  )
}

export default function Diary() {
  const entries = useDiaryStore(s => s.entries)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [editingEntry, setEditingEntry] = useState<DiaryEntry | undefined>()

  const [filterMood, setFilterMood] = useState<Mood | 'all'>('all')

  const filteredEntries =
    filterMood === 'all' ? entries : entries.filter(e => e.mood === filterMood)

  // Group entries by month
  const groupedEntries = filteredEntries.reduce(
    (acc, entry) => {
      const monthYear = dayjs(entry.date).format('MMMM YYYY')

      if (!acc[monthYear]) {
        acc[monthYear] = []
      }
      acc[monthYear].push(entry)

      return acc
    },
    {} as Record<string, DiaryEntry[]>
  )

  const handleEdit = (entry: DiaryEntry) => {
    setEditingEntry(entry)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEntry(undefined)
  }

  if (entries.length === 0) {
    return (
      <div className="flex h-full animate-[fadeSlideIn_0.3s_ease-out] flex-col">
        <ModuleHeader title="Investing Diary" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="bg-bg-200 dark:bg-bg-700 flex size-24 items-center justify-center rounded-full">
            <Icon className="text-bg-400 size-12" icon="tabler:notebook" />
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="mb-1 text-lg font-semibold">Nothing in Diary</h3>
            <p className="text-bg-500 mb-4 max-w-sm">
              Add a new diary entry to get started!
            </p>
            <Button icon="tabler:plus" onClick={() => setIsModalOpen(true)}>
              Write Your First Entry
            </Button>
          </div>
        </div>
        <NewEntryModal
          key={editingEntry?.id ?? 'new'}
          editEntry={editingEntry}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    )
  }

  return (
    <div className="animate-[fadeSlideIn_0.3s_ease-out]">
      <ModuleHeader title="Investing Diary" />
      <div className="space-y-6">
        {/* Header with filters and add button */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                filterMood === 'all'
                  ? 'bg-custom-500 text-white'
                  : 'bg-bg-100 dark:bg-bg-800 text-bg-500 hover:text-bg-800 dark:hover:text-bg-200'
              }`}
              type="button"
              onClick={() => setFilterMood('all')}
            >
              All
            </button>
            {MOODS.map(m => {
              const config = MOOD_CONFIG[m]

              return (
                <button
                  key={m}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    filterMood === m
                      ? `${config.bgColor} ${config.color}`
                      : 'bg-bg-100 dark:bg-bg-800 text-bg-500 hover:text-bg-800 dark:hover:text-bg-200'
                  }`}
                  type="button"
                  onClick={() => setFilterMood(m)}
                >
                  <Icon className="size-3.5" icon={config.icon} />
                  {config.label}
                </button>
              )
            })}
          </div>
          <Button icon="tabler:plus" onClick={() => setIsModalOpen(true)}>
            New Entry
          </Button>
        </div>

        {/* Entries grouped by month */}
        {Object.entries(groupedEntries).map(([monthYear, monthEntries]) => (
          <div key={monthYear}>
            <h2 className="text-bg-500 mb-3 text-sm font-semibold tracking-wider uppercase">
              {monthYear}
            </h2>
            <div className="space-y-4">
              {monthEntries.map(entry => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onEdit={() => handleEdit(entry)}
                />
              ))}
            </div>
          </div>
        ))}

        {filteredEntries.length === 0 && (
          <Card className="py-8 text-center">
            <p className="text-bg-500">No entries match the selected filter.</p>
          </Card>
        )}
      </div>

      <NewEntryModal
        key={editingEntry?.id ?? 'new'}
        editEntry={editingEntry}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
