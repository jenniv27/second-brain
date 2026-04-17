import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useCooking } from '../../hooks/useGoalsData'
import { COMFORT_RATINGS } from '../../data/goalsData'

function LogMealModal({ onLog, onClose }) {
  const [dish, setDish] = useState('')
  return createPortal(
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(253,240,240,0.65)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '300px', background: 'var(--base)', borderRadius: '1.4rem', boxShadow: '0 12px 48px rgba(232,160,160,0.2)', border: '1px solid rgba(232,160,160,0.25)', padding: '1.4rem 1.25rem 1.2rem' }}>
        <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '1rem', fontWeight: 500, color: 'var(--text-dark)', margin: '0 0 0.25rem' }}>You cooked! ✦</p>
        <p style={{ fontSize: '0.73rem', fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif', color: 'var(--steel)', margin: '0 0 0.9rem' }}>What did you make? (optional)</p>
        <input
          autoFocus
          type="text"
          value={dish}
          onChange={e => setDish(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (onLog(dish || null), onClose())}
          placeholder="e.g. chicken stir fry…"
          style={{ width: '100%', background: 'rgba(244,194,194,0.08)', border: '1px solid rgba(232,160,160,0.25)', borderRadius: '0.85rem', padding: '0.7rem 0.9rem', fontSize: '0.88rem', color: 'var(--text-dark)', fontFamily: 'Lora, Georgia, serif', fontStyle: 'italic', outline: 'none', boxSizing: 'border-box', marginBottom: '0.85rem' }}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '0.6rem', background: 'transparent', border: '1px solid rgba(232,160,160,0.25)', borderRadius: '0.85rem', fontSize: '0.8rem', color: 'var(--steel)', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { onLog(dish || null); onClose() }} style={{ flex: 2, padding: '0.6rem', background: 'var(--rose)', border: 'none', borderRadius: '0.85rem', fontSize: '0.8rem', fontWeight: 500, color: '#fff', cursor: 'pointer' }}>Log it ✦</button>
        </div>
      </div>
    </div>,
    document.body
  )
}

function AddRecipeModal({ onSave, onClose }) {
  const [name, setName]     = useState('')
  const [rating, setRating] = useState('natural')
  return createPortal(
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(253,240,240,0.65)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '300px', background: 'var(--base)', borderRadius: '1.4rem', boxShadow: '0 12px 48px rgba(232,160,160,0.2)', border: '1px solid rgba(232,160,160,0.25)', padding: '1.4rem 1.25rem 1.2rem' }}>
        <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '1rem', fontWeight: 500, color: 'var(--text-dark)', margin: '0 0 0.9rem' }}>Save a recipe</p>
        <input autoFocus type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Recipe name…" style={{ width: '100%', background: 'rgba(244,194,194,0.08)', border: '1px solid rgba(232,160,160,0.25)', borderRadius: '0.85rem', padding: '0.7rem 0.9rem', fontSize: '0.88rem', color: 'var(--text-dark)', outline: 'none', boxSizing: 'border-box', marginBottom: '0.75rem' }} />
        <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--steel)', margin: '0 0 0.45rem' }}>Comfort level</p>
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.9rem' }}>
          {COMFORT_RATINGS.map(r => (
            <button key={r.value} onClick={() => setRating(r.value)} style={{ flex: 1, padding: '0.5rem 0.25rem', borderRadius: '0.75rem', border: `1px solid ${rating === r.value ? 'var(--rose)' : 'rgba(232,160,160,0.25)'}`, background: rating === r.value ? 'rgba(232,160,160,0.12)' : 'transparent', fontSize: '0.74rem', fontWeight: 500, color: rating === r.value ? 'var(--rose)' : 'var(--steel)', cursor: 'pointer', lineHeight: 1.2 }}>
              {r.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '0.6rem', background: 'transparent', border: '1px solid rgba(232,160,160,0.25)', borderRadius: '0.85rem', fontSize: '0.8rem', color: 'var(--steel)', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { if (name.trim()) { onSave({ name, rating }); onClose() } }} disabled={!name.trim()} style={{ flex: 2, padding: '0.6rem', background: name.trim() ? 'var(--rose)' : 'rgba(232,160,160,0.2)', border: 'none', borderRadius: '0.85rem', fontSize: '0.8rem', fontWeight: 500, color: name.trim() ? '#fff' : 'var(--steel)', cursor: name.trim() ? 'pointer' : 'default' }}>Save ✦</button>
        </div>
      </div>
    </div>,
    document.body
  )
}

function RecipesView({ recipes, onAdd, onDelete, onBack }) {
  const [showAdd, setShowAdd] = useState(false)
  return (
    <div>
      {showAdd && <AddRecipeModal onSave={onAdd} onClose={() => setShowAdd(false)} />}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '0.78rem', color: 'var(--steel)', cursor: 'pointer', padding: 0 }}>← Back</button>
        <button onClick={() => setShowAdd(true)} style={{ background: 'none', border: 'none', fontSize: '0.78rem', color: 'var(--rose)', cursor: 'pointer', fontStyle: 'italic' }}>+ Add recipe</button>
      </div>
      <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--steel)', margin: '0 0 0.65rem' }}>Recipes</p>
      {recipes.length === 0 ? (
        <p style={{ fontSize: '0.73rem', fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif', color: 'var(--steel)', margin: 0, opacity: 0.7 }}>No recipes yet. Add the ones you return to.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {recipes.map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(232,160,160,0.08)' }}>
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dark)', margin: '0 0 0.1rem' }}>{r.name}</p>
                <p style={{ fontSize: '0.68rem', color: 'var(--steel)', margin: 0, fontStyle: 'italic' }}>{COMFORT_RATINGS.find(c => c.value === r.rating)?.label}</p>
              </div>
              <button onClick={() => onDelete(r.id)} style={{ background: 'none', border: 'none', fontSize: '0.7rem', color: 'var(--steel)', cursor: 'pointer', opacity: 0.45 }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CookingModule({ showRecipes, onShowRecipes, onHideRecipes }) {
  const { mealsThisMonth, recipes, logMeal, addRecipe, deleteRecipe } = useCooking()
  const [showLog, setShowLog] = useState(false)

  if (showRecipes) {
    return <RecipesView recipes={recipes} onAdd={addRecipe} onDelete={deleteRecipe} onBack={onHideRecipes} />
  }

  return (
    <>
      {showLog && <LogMealModal onLog={logMeal} onClose={() => setShowLog(false)} />}
      <div>
        <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--steel)', margin: '0 0 0.5rem' }}>Cooking</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.6rem' }}>
          <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-dark)', margin: 0 }}>{mealsThisMonth}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--steel)', margin: 0 }}>home-cooked meals this month</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setShowLog(true)} style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.72rem', color: 'var(--rose)', cursor: 'pointer', fontStyle: 'italic' }}>+ Log a meal</button>
          <span style={{ color: 'rgba(232,160,160,0.4)', fontSize: '0.72rem' }}>·</span>
          <button onClick={onShowRecipes} style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.72rem', color: 'var(--steel)', cursor: 'pointer', fontStyle: 'italic' }}>Recipes ({recipes.length})</button>
        </div>
      </div>
    </>
  )
}
