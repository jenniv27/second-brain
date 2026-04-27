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
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="scroll-area">
        {activeTab === 'home'    && <HomeTab onGoToMoney={() => setActiveTab('daily')} onGoToBody={() => setActiveTab('daily')} />}
        {activeTab === 'daily'   && <DailyTab />}
        {activeTab === 'hobbies' && <HobbiesTab />}
      </div>
      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
