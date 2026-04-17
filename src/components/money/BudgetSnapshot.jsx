import { useState } from 'react'
import { toUSD, formatUSD } from '../../services/ynab'
import { SYSTEM_GROUPS } from '../../data/moneyData'

// ── Spend bar ─────────────────────────────────

function SpendBar({ budgeted, activity, height = 4 }) {
  const spent  = Math.abs(toUSD(activity))
  const budget = toUSD(budgeted)
  if (budget <= 0) return null
  const pct  = Math.min((spent / budget) * 100, 100)
  const over = spent > budget

  return (
    <div style={{
      width: '100%', height: `${height}px`,
      background: 'rgba(140,155,171,0.15)',
      borderRadius: `${height / 2}px`,
      marginTop: '0.3rem',
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${pct}%`, height: '100%',
        borderRadius: `${height / 2}px`,
        background: over ? 'rgba(232,130,130,0.75)' : 'var(--rose)',
        transition: 'width 0.4s ease',
      }} />
    </div>
  )
}

// ── Individual category row ───────────────────

function CategoryRow({ category }) {
  if (category.hidden || category.budgeted === 0) return null

  const spent   = formatUSD(category.activity * -1)
  const budget  = formatUSD(category.budgeted)
  const balance = toUSD(category.balance)
  const over    = balance < 0

  return (
    <div style={{
      padding: '0.55rem 0',
      borderBottom: '1px solid rgba(232,160,160,0.08)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-dark)', margin: 0, flex: 1 }}>
          {category.name}
        </p>
        <p style={{ fontSize: '0.7rem', color: over ? 'var(--rose)' : 'var(--steel)', margin: 0, whiteSpace: 'nowrap' }}>
          {spent} / {budget}
        </p>
      </div>
      <SpendBar budgeted={category.budgeted} activity={category.activity} />
    </div>
  )
}

// ── Category group card ───────────────────────

function GroupCard({ group }) {
  const [expanded, setExpanded] = useState(false)

  const cats = group.categories.filter(c => !c.hidden && c.budgeted !== 0)
  if (cats.length === 0) return null

  const totalBudgeted = cats.reduce((s, c) => s + c.budgeted, 0)
  const totalActivity = cats.reduce((s, c) => s + c.activity, 0)
  const totalBalance  = cats.reduce((s, c) => s + c.balance,  0)
  const over          = totalBalance < 0

  const spent   = formatUSD(totalActivity * -1)
  const balance = formatUSD(totalBalance)

  return (
    <div className="card" style={{ overflow: 'hidden', border: '1px solid rgba(232,160,160,0.18)', padding: 0 }}>
      {/* Group header — tap to expand */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left',
          padding: '0.8rem 1rem 0.6rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', margin: '0 0 0.1rem' }}>
            {group.name}
          </p>
          <span style={{ fontSize: '0.55rem', color: 'var(--rose)', opacity: 0.5 }}>
            {expanded ? '▲' : '▼'}
          </span>
        </div>
        <p style={{ fontSize: '0.7rem', color: over ? 'var(--rose)' : 'var(--steel)', margin: 0 }}>
          {spent} spent
          {' · '}
          {over
            ? `${balance} over budget`
            : `${balance} remaining`}
        </p>
        <SpendBar budgeted={totalBudgeted} activity={totalActivity} height={5} />
      </button>

      {/* Expanded categories */}
      {expanded && (
        <div style={{ padding: '0 1rem 0.5rem', borderTop: '1px solid rgba(232,160,160,0.1)' }}>
          {cats.map(c => <CategoryRow key={c.id} category={c} />)}
        </div>
      )}
    </div>
  )
}

// ── Main export ───────────────────────────────

export default function BudgetSnapshot({ categoryGroups }) {
  const visible = categoryGroups.filter(
    g => !g.hidden && !SYSTEM_GROUPS.includes(g.name)
  )

  if (visible.length === 0) {
    return (
      <p style={{ fontSize: '0.78rem', fontStyle: 'italic', color: 'var(--steel)', textAlign: 'center', padding: '1rem 0' }}>
        No categories found.
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {visible.map(g => <GroupCard key={g.id} group={g} />)}
    </div>
  )
}
