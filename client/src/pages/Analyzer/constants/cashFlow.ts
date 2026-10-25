export const CASH_FLOW_OPTIONS = [
  { value: 'profit_inflow', labelKey: 'profitInflow' },
  { value: 'profit_outflow', labelKey: 'profitOutflow' },
  { value: 'loss_inflow', labelKey: 'lossInflow' },
  { value: 'loss_outflow', labelKey: 'lossOutflow' }
] as const

export type CashFlowOption = (typeof CASH_FLOW_OPTIONS)[number]['value']
