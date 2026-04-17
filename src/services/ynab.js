// ─────────────────────────────────────────────
//  YNAB API — called directly from the browser
//  Personal Access Token stored in localStorage
// ─────────────────────────────────────────────

const BASE = 'https://api.ynab.com/v1'

// ── Token / budget storage ────────────────────

export function getToken() {
  return localStorage.getItem('money:ynab_token') || ''
}

export function setToken(token) {
  localStorage.setItem('money:ynab_token', token.trim())
}

export function getBudgetId() {
  return localStorage.getItem('money:ynab_budget_id') || ''
}

export function setBudgetId(id) {
  localStorage.setItem('money:ynab_budget_id', id)
}

export function clearCredentials() {
  localStorage.removeItem('money:ynab_token')
  localStorage.removeItem('money:ynab_budget_id')
  localStorage.removeItem('money:ynab_cache')
}

// ── API helper ────────────────────────────────

async function ynabFetch(path) {
  const token = getToken()
  if (!token) throw new Error('no_token')

  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (res.status === 401) throw new Error('invalid_token')
  if (!res.ok) throw new Error('api_error')

  const json = await res.json()
  return json.data
}

// ── Endpoints ─────────────────────────────────

export async function fetchBudgets() {
  const data = await ynabFetch('/budgets')
  return data.budgets
}

export async function fetchCurrentMonth(budgetId) {
  const data = await ynabFetch(`/budgets/${budgetId}/months/current`)
  return data.month
}

export async function fetchCategories(budgetId) {
  const data = await ynabFetch(`/budgets/${budgetId}/categories`)
  return data.category_groups
}

// ── Formatting ────────────────────────────────

// YNAB uses milliunits (1000 = $1.00)
export function toUSD(milliunits) {
  return milliunits / 1000
}

export function formatUSD(milliunits) {
  const amount = Math.abs(toUSD(milliunits))
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

// Build a plain-text budget summary for the companion prompt
export function buildBudgetContext(month, categoryGroups, systemGroups) {
  const lines = []

  if (month) {
    const monthLabel = new Date(month.month + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    lines.push(`Month: ${monthLabel}`)
    lines.push(`Ready to assign: ${formatUSD(month.to_be_budgeted)}`)
    lines.push('')
  }

  const visible = categoryGroups.filter(
    g => !g.hidden && !systemGroups.includes(g.name)
  )

  for (const group of visible) {
    const cats = group.categories.filter(c => !c.hidden && c.budgeted !== 0)
    if (cats.length === 0) continue

    lines.push(`${group.name}:`)
    for (const c of cats) {
      const spent = formatUSD(c.activity * -1)
      const budget = formatUSD(c.budgeted)
      const balance = toUSD(c.balance)
      const status = balance < 0 ? `$${Math.abs(balance).toFixed(0)} over` : `$${balance.toFixed(0)} left`
      lines.push(`  ${c.name}: ${spent} of ${budget} (${status})`)
    }
    lines.push('')
  }

  return lines.join('\n')
}
