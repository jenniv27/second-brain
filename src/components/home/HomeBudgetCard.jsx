import { Wallet } from 'lucide-react'
import { useYNABData } from '../../hooks/useMoneyData'
import { VARIABLE_CATEGORIES, SYSTEM_GROUPS } from '../../data/moneyData'
import { toUSD, formatUSD } from '../../services/ynab'
import { MicroMotifs } from '../Decorations'

function MiniBar({ budgeted, activity }) {
  const spent  = Math.abs(toUSD(activity))
  const budget = toUSD(budgeted)
  if (budget <= 0) return null
  const pct  = Math.min((spent / budget) * 100, 100)
  const over = spent > budget
  return (
    <div style={{ flex: 1, height: '4px', background: 'rgba(140,155,171,0.15)', borderRadius: '2px', overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', borderRadius: '2px', background: over ? 'rgba(232,110,110,0.7)' : 'var(--rose)', transition: 'width 0.4s ease' }} />
    </div>
  )
}

function CategoryRow({ category }) {
  const balance = toUSD(category.balance)
  const over    = balance < 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.28rem 0' }}>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-dark)', margin: 0, minWidth: '7rem', flexShrink: 0 }}>
        {category.name}
      </p>
      <MiniBar budgeted={category.budgeted} activity={category.activity} />
      <p style={{ fontSize: '0.7rem', color: over ? 'var(--rose)' : 'var(--steel)', margin: 0, whiteSpace: 'nowrap', flexShrink: 0 }}>
        {over ? `${formatUSD(category.balance * -1)} over` : `${formatUSD(category.balance)} left`}
      </p>
    </div>
  )
}

export default function HomeBudgetCard({ onGoToMoney }) {
  const { data, loading } = useYNABData()

  const noSetup = !localStorage.getItem('money:ynab_token')

  const categories = data
    ? VARIABLE_CATEGORIES
        .map(name =>
          data.categoryGroups
            .filter(g => !g.hidden && !SYSTEM_GROUPS.includes(g.name))
            .flatMap(g => g.categories)
            .find(c => !c.hidden && c.name.toLowerCase() === name.toLowerCase())
        )
        .filter(Boolean)
    : []

  const monthLabel = data?.month?.month
    ? new Date(data.month.month + 'T12:00:00').toLocaleDateString('en-US', { month: 'long' })
    : null

  return (
    <div
      className="card card-accent"
      style={{ padding: '1rem 1.25rem', marginBottom: '0.9rem' }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '2rem', height: '2rem', borderRadius: '0.6rem', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--pink), var(--base))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Wallet size={14} strokeWidth={1.5} color="var(--rose)" />
          </div>
          <div>
            <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-dark)', margin: 0 }}>
              Budget snapshot
            </p>
            {monthLabel && (
              <p style={{ fontSize: '0.68rem', color: 'var(--steel)', margin: 0 }}>{monthLabel}</p>
            )}
          </div>
        </div>
        <MicroMotifs count={3} />
      </div>

      {/* Body */}
      {noSetup ? (
        <p style={{ fontSize: '0.75rem', fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif', color: 'var(--steel)', margin: 0 }}>
          Connect YNAB in the{' '}
          <button onClick={onGoToMoney} style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--rose)', cursor: 'pointer', fontFamily: 'Lora, Georgia, serif' }}>
            Money tab →
          </button>
        </p>
      ) : loading && categories.length === 0 ? (
        <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--steel)', margin: 0, opacity: 0.6 }}>Loading…</p>
      ) : categories.length === 0 ? (
        <p style={{ fontSize: '0.75rem', fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif', color: 'var(--steel)', margin: 0 }}>
          Open the{' '}
          <button onClick={onGoToMoney} style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--rose)', cursor: 'pointer', fontFamily: 'Lora, Georgia, serif' }}>
            Money tab →
          </button>
          {' '}to load your budget.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {categories.map(c => <CategoryRow key={c.id} category={c} />)}
        </div>
      )}
    </div>
  )
}
