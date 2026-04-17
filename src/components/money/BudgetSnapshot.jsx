import { toUSD, formatUSD } from '../../services/ynab'
import { VARIABLE_CATEGORIES, SYSTEM_GROUPS } from '../../data/moneyData'

// ── Spend bar ─────────────────────────────────

function SpendBar({ budgeted, activity }) {
  const spent  = Math.abs(toUSD(activity))
  const budget = toUSD(budgeted)
  if (budget <= 0) return null
  const pct  = Math.min((spent / budget) * 100, 100)
  const over = spent > budget

  return (
    <div style={{
      width: '100%', height: '5px',
      background: 'rgba(140,155,171,0.15)',
      borderRadius: '3px',
      marginTop: '0.4rem',
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${pct}%`, height: '100%',
        borderRadius: '3px',
        background: over ? 'rgba(232,130,130,0.75)' : 'var(--rose)',
        transition: 'width 0.4s ease',
      }} />
    </div>
  )
}

// ── Single category row ───────────────────────

function CategoryRow({ category }) {
  const spent   = formatUSD(category.activity * -1)
  const budget  = formatUSD(category.budgeted)
  const balance = toUSD(category.balance)
  const over    = balance < 0

  return (
    <div className="card" style={{
      border: '1px solid rgba(232,160,160,0.18)',
      padding: '0.75rem 1rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-dark)', margin: 0 }}>
          {category.name}
        </p>
        <p style={{ fontSize: '0.72rem', color: over ? 'var(--rose)' : 'var(--steel)', margin: 0, whiteSpace: 'nowrap' }}>
          {over
            ? `${formatUSD(category.balance * -1)} over`
            : `${formatUSD(category.balance)} left`}
        </p>
      </div>
      <p style={{ fontSize: '0.7rem', color: 'var(--steel)', margin: '0.15rem 0 0', opacity: 0.75 }}>
        {spent} spent of {budget}
      </p>
      <SpendBar budgeted={category.budgeted} activity={category.activity} />
    </div>
  )
}

// ── Main export ───────────────────────────────

export default function BudgetSnapshot({ categoryGroups }) {
  // Flatten all categories from all non-system groups
  const allCategories = categoryGroups
    .filter(g => !g.hidden && !SYSTEM_GROUPS.includes(g.name))
    .flatMap(g => g.categories)

  // Filter to only the whitelisted names (case-insensitive)
  const visible = VARIABLE_CATEGORIES
    .map(name =>
      allCategories.find(c =>
        !c.hidden &&
        c.name.toLowerCase() === name.toLowerCase()
      )
    )
    .filter(Boolean)

  if (visible.length === 0) {
    return (
      <p style={{ fontSize: '0.78rem', fontStyle: 'italic', color: 'var(--steel)', textAlign: 'center', padding: '1rem 0' }}>
        No matching categories found. Make sure your YNAB category names match exactly.
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
      {visible.map(c => <CategoryRow key={c.id} category={c} />)}
    </div>
  )
}
