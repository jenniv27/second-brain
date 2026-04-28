import { useState } from 'react'
import TabBar from './components/TabBar'
import HomeTab from './tabs/HomeTab'
import DailyTab from './tabs/DailyTab'
import HobbiesTab from './tabs/HobbiesTab'

const TABS = [
  { id: 'home',    label: 'Home'    },
  { id: 'daily',   label: 'Daily'   },
  { id: 'hobbies', label: 'Hobbies' },
]

function App() {
  const [activeTab, setActiveTab]   = useState('home')
  const [lowEnergy, setLowEnergy]   = useState(false)

  function handleLowEnergy(on) {
    setLowEnergy(on)
    if (on) setActiveTab('home')
  }

  const visibleTabs = lowEnergy ? TABS.filter(t => t.id === 'home') : TABS

  function handleTabChange(tabId) {
    if (lowEnergy) handleLowEnergy(false)
    setActiveTab(tabId)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="scroll-area">
        {activeTab === 'home'    && <HomeTab onGoToMoney={() => setActiveTab('daily')} onGoToBody={() => setActiveTab('daily')} lowEnergy={lowEnergy} onLowEnergyChange={handleLowEnergy} />}
        {activeTab === 'daily'   && <DailyTab />}
        {activeTab === 'hobbies' && <HobbiesTab />}
      </div>
      <TabBar tabs={visibleTabs} activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}

export default App
