import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useSocial } from '../../hooks/useGoalsData'

function AddMeetupModal({ onAdd, onClose }) {
  const [description, setDescription] = useState('')
  return createPortal(
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(253,240,240,0.65)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '300px', background: 'var(--base)', borderRadius: '1.4rem', boxShadow: '0 12px 48px rgba(232,160,160,0.2)', border: '1px solid rgba(232,160,160,0.25)', padding: '1.4rem 1.25rem 1.2rem' }}>
        <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '1rem', fontWeight: 500, color: 'var(--text-dark)', margin: '0 0 0.25rem' }}>You went out ✦</p>
        <p style={{ fontSize: '0.73rem', fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif', color: 'var(--steel)', margin: '0 0 0.9rem' }}>What was it? (optional)</p>
        <input
          autoFocus
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (onAdd(description || null), onClose())}
          placeholder="e.g. coffee with a friend…"
          style={{ width: '100%', background: 'rgba(244,194,194,0.08)', border: '1px solid rgba(232,160,160,0.25)', borderRadius: '0.85rem', padding: '0.7rem 0.9rem', fontSize: '0.88rem', color: 'var(--text-dark)', fontFamily: 'Lora, Georgia, serif', fontStyle: 'italic', outline: 'none', boxSizing: 'border-box', marginBottom: '0.85rem' }}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '0.6rem', background: 'transparent', border: '1px solid rgba(232,160,160,0.25)', borderRadius: '0.85rem', fontSize: '0.8rem', color: 'var(--steel)', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { onAdd(description || null); onClose() }} style={{ flex: 2, padding: '0.6rem', background: 'var(--rose)', border: 'none', borderRadius: '0.85rem', fontSize: '0.8rem', fontWeight: 500, color: '#fff', cursor: 'pointer' }}>Add ✦</button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function SocialModule() {
  const { total, meetups, addMeetup, lastAck } = useSocial()
  const [showAdd, setShowAdd] = useState(false)
  const recent = meetups.slice(0, 3)

  return (
    <>
      {showAdd && <AddMeetupModal onAdd={addMeetup} onClose={() => setShowAdd(false)} />}
      <div>
        <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--steel)', margin: '0 0 0.5rem' }}>Solo Social</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.55rem' }}>
          <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-dark)', margin: 0 }}>{total}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--steel)', margin: 0 }}>meetup{total !== 1 ? 's' : ''} total</p>
        </div>

        {/* Recent entries */}
        {recent.length > 0 && (
          <div style={{ marginBottom: '0.6rem' }}>
            {recent.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0' }}>
                <span style={{ fontSize: '0.55rem', color: 'var(--rose)', opacity: 0.6 }}>✦</span>
                <p style={{ fontSize: '0.75rem', fontFamily: 'Lora, Georgia, serif', fontStyle: 'italic', color: 'var(--text-mid)', margin: 0 }}>
                  {m.description ?? m.date}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Warm acknowledgment */}
        {lastAck && (
          <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--rose)', margin: '0 0 0.5rem', animation: 'fadeUp 0.3s ease' }}>
            {lastAck}
          </p>
        )}

        <button onClick={() => setShowAdd(true)} style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.72rem', color: 'var(--rose)', cursor: 'pointer', fontStyle: 'italic' }}>
          + Add meetup
        </button>
      </div>
    </>
  )
}
