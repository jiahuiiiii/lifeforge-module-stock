# 📈 Stock Module

<img width="4750" height="3359" alt="Untitled (A4 (Landscape))" src="https://github.com/user-attachments/assets/c71239e9-0c9b-466f-94bd-62fe6cb7c3a8" />

A comprehensive stock tracking and analysis module for LifeForge. Track your investments, manage watchlists, build virtual portfolios, and analyze stocks using the Cold Eye Investment Strategy.

## ✨ Features

### 📊 Dashboard

Real-time stock data visualization with interactive charts. Search for any stock and view:

- Live price quotes and daily changes
- Historical price charts with multiple timeframes (1D, 5D, 1M, 3M, 6M, 1Y, 5Y)
- Key financial metrics at a glance
- Quick add to watchlist functionality

<img width="1512" height="982" alt="dashboard" src="https://github.com/user-attachments/assets/ae05299b-b2f7-4b03-813b-ca6ee1d40c37" />

---

### ⭐ Watchlist

Keep track of stocks you're interested in:

- Add stocks from the dashboard with one click
- Real-time price updates
- Quick access to detailed stock information
- Easily manage and organize your watchlist

<img width="1512" height="982" alt="watchlist" src="https://github.com/user-attachments/assets/b5e54080-9569-4309-b07b-298f84e785f4" />

---

### 📓 Investing Diary

Document your investment thoughts and research:

- Create diary entries with rich text
- Track your investment thesis and decisions
- Attach images to your entries
- Filter by mood (Bullish/Neutral/Bearish/Excited/Anxious)

<img width="1512" height="982" alt="diary" src="https://github.com/user-attachments/assets/daa04cfe-ad50-423a-a485-182f8d15ae7b" />

---

### 🔬 Stock Analyzer (Cold Eye Strategy)

A comprehensive stock analysis tool based on the Cold Eye Investment Strategy. Evaluate stocks using quantitative metrics across two key dimensions:

#### Phase 1: Sleep Strategy Gate

Review qualitative factors before quantitative analysis.

<img width="1512" height="982" alt="analyzer-phase1" src="https://github.com/user-attachments/assets/7480c5bb-d146-4e1d-b210-7bd780fdacd1" />

#### Phase 2: Quantitative Data Entry

Enter financial metrics for GDP and PRC scoring.

| GDP Score - Creating Wealth | PRC Score - Sustaining Wealth |
| --------------------------- | ----------------------------- |
| **G**rowth (CAGR) - 50 pts  | **P**rofit Margin - 20 pts    |
| **D**ividend Yield - 40 pts | **R**OE - 20 pts              |
| **P**E Ratio - 30 pts       | **C**ash Flow - 40 pts        |

<img width="1512" height="982" alt="analyzer-phase2" src="https://github.com/user-attachments/assets/2ece1d35-a00c-48a5-9dd1-1284ae8268d8" />

#### Phase 3: The Verdict

- ✅ **PASS** - Both GDP and PRC scores ≥ 50 → Strong Investment Candidate
- ⚠️ **NEUTRAL** - One score ≥ 50, one < 50 → Watch and Monitor
- ❌ **FAIL** - Both scores < 50 → Reject

<img width="1512" height="982" alt="analyzer-phase3" src="https://github.com/user-attachments/assets/5c3704f7-2064-4a20-bf8a-8fc8491e66ad" />

---

### 🧮 Analyzer Toolbox

A suite of calculators for quick financial computations:

**GDP Calculators:** CAGR, Dividend Yield, P/E Ratio  
**PRC Calculators:** Profit Margin, ROE  
**Supplementary:** Zulu Checker, Historical PE Discount, P/S Scanner

Features:

- Supports **k/M/B suffixes** (e.g., 50M, 2.5B)
- Handles **negative numbers** for loss scenarios
- Save calculations to **Logbook** for future reference

<img width="1512" height="982" alt="calculator" src="https://github.com/user-attachments/assets/d23bc0d4-ee04-459d-8b30-e15ac56705c6" />

---

### 📖 Analysis Logbook

Store and review all your analyses:

**Stock Analyses Tab** - Complete GDP/PRC analysis records with verdicts

<img width="1512" height="982" alt="logbook-analysis" src="https://github.com/user-attachments/assets/dad35ac1-cfef-4cf2-8de3-54c7a5909cca" />

**Calculations Tab** - Saved calculator results for quick reference

<img width="1512" height="982" alt="logbook-calculations" src="https://github.com/user-attachments/assets/6c69a7f9-963a-472a-948d-8db088608dd8" />

---

### ⚙️ Customizable Settings

Fine-tune the analysis parameters to match your investment style:

- Adjust scoring thresholds for each metric
- Customize cash flow scoring weights
- Reset to default values anytime

<img width="1512" height="982" alt="settings" src="https://github.com/user-attachments/assets/18f86a24-fd7a-4edc-a8d6-64bebc879cb6" />

---

### 📚 Guide

Built-in guide to help you understand the Cold Eye Investment Strategy.

<img width="1512" height="982" alt="guide" src="https://github.com/user-attachments/assets/9118134e-aa20-4551-a061-31c6c819befe" />

---

## 🔑 API Requirements

This module requires a **Financial Modeling Prep (FMP)** API key for:

- Real-time stock quotes
- Historical price data
- Stock search functionality

> **Note:** Some features may be limited on the free tier.

---

## 📄 License

Part of the LifeForge ecosystem. See main repository for license details.
