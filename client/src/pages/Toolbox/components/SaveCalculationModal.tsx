import { FormModal, defineForm } from 'lifeforge-ui'

export default function SaveCalculationModal({
  onClose,
  data: { onSave }
}: {
  onClose: () => void
  data: {
    onSave: (info: {
      ticker: string
      name: string
      exchange: string
      date: string
    }) => void
  }
}) {
  const { formProps } = defineForm<{
    ticker: string
    name: string
    exchange: string
    date: string
  }>({
    icon: 'tabler:device-floppy',
    onClose,
    title: 'Save Calculation',
    submitButton: {
      icon: 'tabler:device-floppy',
      children: 'Save'
    },
    namespace: 'jiahuiiiii$stock'
  })
    .typesMap({
      ticker: 'text',
      name: 'text',
      exchange: 'text',
      date: 'datetime'
    })
    .setupFields({
      ticker: {
        label: 'Ticker',
        icon: 'tabler:currency-dollar',
        placeholder: 'e.g., AAPL',
        required: true
      },
      name: {
        label: 'Company Name',
        icon: 'tabler:building',
        placeholder: 'e.g., Apple Inc.'
      },
      exchange: {
        label: 'Exchange',
        icon: 'tabler:status-change',
        placeholder: 'e.g., NASDAQ'
      },
      date: {
        label: 'Date',
        icon: 'tabler:calendar'
      }
    })
    .autoFocusField('ticker')
    .onSubmit(async data => {
      onSave(data)
    })
    .build()

  return <FormModal {...formProps} />
}
