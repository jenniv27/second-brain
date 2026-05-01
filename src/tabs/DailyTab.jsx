import { useState } from 'react'
import SubTabNav from '../components/SubTabNav'
import BodyTab from './BodyTab'
import MindTab from './MindTab'
import MoneyTab from './MoneyTab'

const SUBTABS = [
  { id: 'body',  label: 'Body'  },
  { id: 'mind',  label: 'Mind'  },
  { id: 'money', label: 'Money' },
]

export default function DailyTab() {
  const [active, setActive] = useState('body')

  return (
    <div className="fade-up">
      <SubTabNav tabs={SUBTABS} active={active} onChange={setActive} />
      {active === 'body'  && <BodyTab />}
      {active === 'mind'  && <MindTab />}
      {active === 'money' && <MoneyTab />}
    </div>
  )
}
