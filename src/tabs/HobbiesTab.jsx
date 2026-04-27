import { useState } from 'react'
import SubTabNav from '../components/SubTabNav'
import LearnTab from './LearnTab'
import ReadTab from './ReadTab'
import WorldTab from './WorldTab'

const SUBTABS = [
  { id: 'learn', label: 'Learn' },
  { id: 'read',  label: 'Read'  },
  { id: 'world', label: 'World' },
]

export default function HobbiesTab() {
  const [active, setActive] = useState('learn')

  return (
    <div className="fade-up">
      <SubTabNav tabs={SUBTABS} active={active} onChange={setActive} />
      {active === 'learn' && <LearnTab />}
      {active === 'read'  && <ReadTab />}
      {active === 'world' && <WorldTab />}
    </div>
  )
}
