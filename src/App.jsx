import { useState } from 'react'
import TabBar from './components/TabBar'
import HomeTab from './tabs/HomeTab'
import BodyTab from './tabs/BodyTab'
import MindTab from './tabs/MindTab'
import PlaceholderTab from './tabs/PlaceholderTab'
import ReadTab from './tabs/ReadTab'
import MoneyTab from './tabs/MoneyTab'
import WorldTab from './tabs/WorldTab'
import LearnTab from './tabs/LearnTab'

const TABS = [
  { id: 'home',   label: 'Home',   icon: '🏠' },
  { id: 'body',   label: 'Body',   icon: '🌸' },
  { id: 'mind',   label: 'Mind',   icon: '✦'  },
  { id: 'money',  label: 'Money',  icon: '💫' },
  { id: 'learn',  label: 'Learn',  icon: '🌙' },
  { id: 'world',  label: 'World',  icon: '🌍' },
  { id: 'read',   label: 'Read',   icon: '📖' },
]

function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="scroll-area">
        {activeTab === 'home'  && <HomeTab onGoToMoney={() => setActiveTab('money')} onGoToBody={() => setActiveTab('body')} />}
        {activeTab === 'body'  && <BodyTab />}
        {activeTab === 'mind'  && <MindTab />}
        {activeTab === 'money' && <MoneyTab />}
        {activeTab === 'learn' && <LearnTab />}
        {activeTab === 'world' && <WorldTab />}
        {activeTab === 'read'  && <ReadTab />}
      </div>
      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
