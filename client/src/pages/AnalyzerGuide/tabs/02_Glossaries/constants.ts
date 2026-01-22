const TERMS = [
  {
    term: 'CAGR',
    fullName: 'Compound Annual Growth Rate',
    latex:
      '\\left(\\dfrac{\\text{End Value}}{\\text{Start Value}}\\right)^{\\frac{1}{n}} - 1',
    description:
      'Measures the average annual growth rate of an investment over a specified period, smoothing out volatility.',
    color: 'green'
  },
  {
    term: 'PE Ratio',
    fullName: 'Price-to-Earnings',
    latex: '\\dfrac{\\text{Stock Price}}{\\text{EPS}}',
    description:
      'Shows how much investors are willing to pay for each dollar of earnings. Lower is generally better.',
    color: 'blue'
  },
  {
    term: 'PEG Ratio',
    fullName: 'Price/Earnings to Growth',
    latex: '\\dfrac{\\text{PE Ratio}}{\\text{CAGR}}',
    description:
      'Adjusts PE for growth. A PEG ≤ 1.0 suggests the stock may be undervalued relative to its growth rate (Zulu Principle).',
    color: 'purple'
  },
  {
    term: 'Dividend Yield',
    fullName: 'Annual Dividend Return',
    latex:
      '\\dfrac{\\text{Annual Dividend}}{\\text{Stock Price}} \\times 100\\%',
    description:
      'The percentage return from dividends alone. Higher yields indicate better income potential.',
    color: 'orange'
  },
  {
    term: 'Net Profit Margin',
    fullName: 'Profitability Ratio',
    latex: '\\dfrac{\\text{Net Profit}}{\\text{Revenue}} \\times 100\\%',
    description:
      'Shows how much profit a company keeps from each dollar of revenue. Higher margins indicate better efficiency.',
    color: 'teal'
  },
  {
    term: 'ROE',
    fullName: 'Return on Equity',
    latex:
      '\\dfrac{\\text{Net Income}}{\\text{Shareholder Equity}} \\times 100\\%',
    description:
      'Measures how effectively a company uses shareholder capital to generate profits.',
    color: 'pink'
  },
  {
    term: 'P/S Ratio',
    fullName: 'Price-to-Sales',
    latex: '\\dfrac{\\text{Market Cap}}{\\text{Total Revenue}}',
    description:
      'Useful for companies with low or negative earnings. Must be combined with profit margin analysis.',
    color: 'indigo'
  }
] as const

export default TERMS
