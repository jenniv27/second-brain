import { Home, Leaf, Star, Sparkles, Globe, BookOpen, Coins } from 'lucide-react'

const ICON_SIZE = 20
const ICON_STROKE = 1.5

const icons = {
  home:   <Home  size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
  body:   <Leaf  size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
  mind:   <Star  size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
  money:  <Coins size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
  learn:  <Sparkles size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
  world:  <Globe size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
  read:   <BookOpen size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
}

export default function TabBar({ tabs, activeTab, onTabChange }) {
  return (
    <nav className="tab-bar">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-item${activeTab === tab.id ? ' active' : ''}`}
          onClick={() => onTabChange(tab.id)}
          aria-label={tab.label}
          style={{ background: 'none', border: 'none', padding: '0.25rem 0' }}
        >
          <span className="tab-icon">{icons[tab.id]}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
