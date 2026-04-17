import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useYNABData, useMoneyCheckins } from '../hooks/useMoneyData'
import {
  getToken, setToken, getBudgetId, setBudgetId,
  fetchBudgets, clearCredentials,
} from '../services/ynab'
import BudgetSnapshot from '../components/money/BudgetSnapshot'
import MoneyCheckin from '../components/money/MoneyCheckin'
import { OrnateDivider, Bow, Wings, MicroMotifs } from '../components/Decorations'

// ── Setup flow ────────────────────────────────

function SetupCard({ onComplete }) {
  const [token, setTokenInput]       = useState('')
  const [budgets, setBudgets]        = useState(null)
  const [selectedId, setSelectedId]  = useState('')
  const [loading, setLoading]        = useState(false)
  const [error, setError]            = useState(null)

  async function handleConnect() {
    if (!token.trim()) return
    setLoading(true)
    setError(null)
    try {
      setToken(token)
      const list = await fetchBudgets()
      setBudgets(list)
      if (list.length === 1) setSelectedId(list[0].id)
    } catch (e) {
      setError(e.message === 'invalid_token'
        ? 'Token not recognised — double-check it in YNAB.'
        : 'Could not connect. Check your internet and try again.')
      setToken('') // clear invalid token
    } finally {
      setLoading(false)
    }
  }

  function handleSave() {
    if (!selectedId) return
    setBudgetId(selectedId)
    onComplete()
  }

  return (
    <div style={{ padding: '1.5rem 1.25rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <MicroMotifs count={5} />
        <h2 style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '1.2rem', fontWeight: 500, color: 'var(--text-dark)', margin: '0.75rem 0 0.4rem' }}>
          Connect your YNAB
        </h2>
        <p style={{ fontSize: '0.78rem', fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif', color: 'var(--steel)', margin: 0, lineHeight: 1.6 }}>
          Your budget, surfaced without the friction of opening another app.
        </p>
      </div>

      <OrnateDivider style={{ margin: '1rem 0 1.25rem' }} />

      {!budgets ? (
        <>
          <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--steel)', margin: '0 0 0.5rem' }}>
            Personal Access Token
          </p>
          <p style={{ fontSize: '0.72rem', color: 'var(--steel)', margin: '0 0 0.75rem', lineHeight: 1.55 }}>
            Get yours at <strong>app.ynab.com → Account Settings → Developer Settings → New Token</strong>
          </p>
          <input
            type="password"
            value={token}
            onChange={e => setTokenInput(e.target.value)}
            placeholder="Paste token here"
            style={{
              width: '100%',
              background: 'var(--base)',
              border: '1px solid rgba(232,160,160,0.25)',
              borderRadius: '0.85rem',
              padding: '0.7rem 0.9rem',
              fontSize: '0.875rem',
              color: 'var(--text-dark)',
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: '0.75rem',
            }}
          />
          {error && (
            <p style={{ fontSize: '0.72rem', color: 'var(--rose)', margin: '0 0 0.75rem', fontStyle: 'italic' }}>{error}</p>
          )}
          <button
            onClick={handleConnect}
            disabled={!token.trim() || loading}
            style={{
              width: '100%',
              background: 'var(--rose)',
              border: 'none',
              borderRadius: '0.85rem',
              padding: '0.65rem',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: '#fff',
              cursor: token.trim() && !loading ? 'pointer' : 'default',
              opacity: token.trim() && !loading ? 1 : 0.5,
            }}
          >
            {loading ? 'Connecting…' : 'Connect ✦'}
          </button>
        </>
      ) : (
        <>
          <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--steel)', margin: '0 0 0.6rem' }}>
            Select Budget
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.85rem' }}>
            {budgets.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedId(b.id)}
                style={{
                  padding: '0.7rem 1rem',
                  background: selectedId === b.id ? 'rgba(232,160,160,0.12)' : 'var(--base)',
                  border: `1px solid ${selectedId === b.id ? 'var(--rose)' : 'rgba(232,160,160,0.2)'}`,
                  borderRadius: '0.85rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-dark)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {b.name}
              </button>
            ))}
          </div>
          <button
            onClick={handleSave}
            disabled={!selectedId}
            style={{
              width: '100%',
              background: 'var(--rose)',
              border: 'none',
              borderRadius: '0.85rem',
              padding: '0.65rem',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: '#fff',
              cursor: selectedId ? 'pointer' : 'default',
              opacity: selectedId ? 1 : 0.5,
            }}
          >
            Save ✦
          </button>
        </>
      )}
    </div>
  )
}

// ── Main tab ──────────────────────────────────

export default function MoneyTab() {
  const hasToken    = !!getToken()
  const hasBudgetId = !!getBudgetId()
  const isSetup     = hasToken && hasBudgetId

  const [setup, setSetup]   = useState(!isSetup)
  const [view, setView]     = useState('overview') // 'overview' | 'checkin'

  const { data, loading, error, refresh } = useYNABData()
  const { saveCheckin, lastCheckin, daysSinceLast } = useMoneyCheckins()

  // ── Setup screen ──
  if (setup) {
    return (
      <div className="fade-up">
        <header style={{
          padding: '1.75rem 1.25rem 1.25rem',
          background: 'linear-gradient(160deg, #f9d8d8 0%, #fce8e8 40%, var(--base) 100%)',
          borderBottom: '1px solid rgba(232,160,160,0.15)',
        }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--steel)', margin: '0 0 0.3rem' }}>Money</p>
          <h1 style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '1.6rem', fontWeight: 500, color: 'var(--text-dark)', margin: 0, lineHeight: 1.2 }}>
            Your budget <span className="star-accent" style={{ fontSize: '0.9rem' }}>✦</span>
          </h1>
        </header>
        <SetupCard onComplete={() => setSetup(false)} />
      </div>
    )
  }

  // ── Check-in screen ──
  if (view === 'checkin') {
    return (
      <div className="fade-up">
        <div style={{
          padding: '1.25rem 1.25rem 0.75rem',
          background: 'linear-gradient(160deg, #f9d8d8 0%, #fce8e8 40%, var(--base) 100%)',
          borderBottom: '1px solid rgba(232,160,160,0.15)',
        }}>
          <button onClick={() => setView('overview')} style={{ background: 'none', border: 'none', fontSize: '0.78rem', color: 'var(--steel)', cursor: 'pointer', padding: 0, marginBottom: '0.5rem' }}>
            ← Back
          </button>
          <h1 style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '1.4rem', fontWeight: 500, color: 'var(--text-dark)', margin: 0 }}>
            Weekly check-in <span className="star-accent" style={{ fontSize: '0.85rem' }}>✦</span>
          </h1>
        </div>
        <MoneyCheckin
          ynabData={data}
          onSave={(entry) => saveCheckin(entry)}
          onClose={() => setView('overview')}
        />
      </div>
    )
  }

  // ── Overview screen ──
  const month = data?.month

  return (
    <div className="fade-up">

      {/* ── Header ── */}
      <header style={{
        position: 'relative',
        padding: '1.75rem 1.25rem 1.25rem',
        background: 'linear-gradient(160deg, #f9d8d8 0%, #fce8e8 40%, var(--base) 100%)',
        borderBottom: '1px solid rgba(232,160,160,0.15)',
        overflow: 'hidden',
      }}>
        <span style={{ position: 'absolute', top: '0.7rem', right: '1.2rem', fontSize: '0.7rem', color: 'var(--rose)', opacity: 0.3, animation: 'starShimmer 5s infinite' }}>✦</span>
        <span style={{ position: 'absolute', top: '1.5rem', right: '0.5rem', fontSize: '0.4rem', color: 'var(--rose)', opacity: 0.2 }}>+</span>

        <p style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--steel)', margin: '0 0 0.3rem' }}>Money</p>
        <h1 style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '1.6rem', fontWeight: 500, color: 'var(--text-dark)', margin: '0 0 0.5rem', lineHeight: 1.2 }}>
          Your budget <span className="star-accent" style={{ fontSize: '0.9rem' }}>✦</span>
        </h1>

        {/* Refresh button */}
        <button
          onClick={refresh}
          disabled={loading}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.4 : 0.6, padding: '0.25rem' }}
        >
          <RefreshCw size={14} color="var(--steel)" style={{ animation: loading ? 'softPulse 1s infinite' : 'none' }} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(232,160,160,0.4), transparent)' }} />
          <Wings size={28} color="var(--rose)" opacity={0.35} />
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, rgba(232,160,160,0.4), transparent)' }} />
        </div>
      </header>

      <div style={{ padding: '1.1rem 1.1rem 0' }}>

        {/* Error state */}
        {error && (
          <div style={{ padding: '0.85rem 1rem', background: 'rgba(244,194,194,0.1)', borderRadius: '0.85rem', border: '1px solid rgba(232,160,160,0.2)', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-mid)', margin: '0 0 0.25rem', fontWeight: 500 }}>
              {error === 'invalid_token' ? 'Token expired or invalid' : 'Could not load budget'}
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--steel)', margin: 0 }}>
              {error === 'invalid_token'
                ? <>Generate a new token in YNAB, then <button onClick={() => { clearCredentials(); setSetup(true) }} style={{ background: 'none', border: 'none', color: 'var(--rose)', cursor: 'pointer', padding: 0, fontSize: '0.72rem' }}>reconnect</button>.</>
                : 'Pull to refresh, or check your internet connection.'}
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !data && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: '4rem', background: 'rgba(232,160,160,0.08)', borderRadius: '1rem', animation: 'softPulse 1.5s infinite' }} />
            ))}
          </div>
        )}

        {/* Budget snapshot */}
        {data?.categoryGroups && (
          <>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--steel)', margin: '0 0 0.65rem' }}>
              This month
            </p>
            <BudgetSnapshot categoryGroups={data.categoryGroups} />
          </>
        )}

        <OrnateDivider style={{ margin: '1.1rem 0' }} />

        {/* ── Weekly check-in card ── */}
        <div className="card card-accent" style={{ marginBottom: '0.85rem', overflow: 'hidden' }}>
          <div style={{
            padding: '0.9rem 1.1rem',
            background: 'linear-gradient(135deg, #fde8e8 0%, #fdf5f5 100%)',
            borderBottom: '1px solid rgba(232,160,160,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bow size={15} color="var(--rose)" opacity={0.65} />
              <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
                Weekly check-in
              </p>
              <MicroMotifs count={2} />
            </div>
          </div>
          <div style={{ padding: '0.85rem 1.1rem' }}>
            <p style={{ fontSize: '0.78rem', fontFamily: 'Lora, Georgia, serif', fontStyle: 'italic', color: 'var(--steel)', margin: '0 0 0.75rem', lineHeight: 1.55 }}>
              {lastCheckin
                ? daysSinceLast === 0
                  ? 'You checked in today. ✦'
                  : `Last check-in ${daysSinceLast} day${daysSinceLast === 1 ? '' : 's'} ago.`
                : 'A quiet look at where you actually stand — with your real numbers.'}
            </p>
            <button
              onClick={() => setView('checkin')}
              disabled={daysSinceLast === 0}
              style={{
                background: daysSinceLast === 0 ? 'transparent' : 'var(--rose)',
                border: daysSinceLast === 0 ? '1px solid rgba(232,160,160,0.3)' : 'none',
                borderRadius: '0.85rem',
                padding: '0.5rem 1.1rem',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: daysSinceLast === 0 ? 'var(--steel)' : '#fff',
                cursor: daysSinceLast === 0 ? 'default' : 'pointer',
                opacity: daysSinceLast === 0 ? 0.6 : 1,
              }}
            >
              {daysSinceLast === 0 ? 'Done for this week' : 'Start check-in'}
            </button>
          </div>
        </div>

        {/* Disconnect link */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <button
            onClick={() => { clearCredentials(); setSetup(true) }}
            style={{ background: 'none', border: 'none', fontSize: '0.68rem', color: 'var(--steel)', cursor: 'pointer', opacity: 0.5 }}
          >
            Disconnect YNAB
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          <MicroMotifs count={5} />
        </div>
      </div>
    </div>
  )
}
