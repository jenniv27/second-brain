import { useState } from 'react'
import SubTabNav from '../components/SubTabNav'
import BodyTab from './BodyTab'
import MindTab from './MindTab'
import MoneyTab from './MoneyTab'
import HabitsTab from './HabitsTab'

const SUBTABS = [
  { id: 'body',   label: 'Body'   },
  { id: 'mind',   label: 'Mind'   },
  { id: 'money',  label: 'Money'  },
  { id: 'habits', label: 'Habits' },
]

export default function DailyTab() {
  const [active, setActive] = useState('habits')

  return (
    <div className="fade-up">
      <SubTabNav tabs={SUBTABS} active={active} onChange={setActive} />
      {active === 'body'   && <BodyTab />}
      {active === 'mind'   && <MindTab />}
      {active === 'money'  && <MoneyTab />}
      {active === 'habits' && <HabitsTab />}
    </div>
  )
}
