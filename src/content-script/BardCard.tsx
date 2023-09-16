import { SearchIcon } from '@primer/octicons-react'
import { useState } from 'preact/hooks'
import { TriggerMode } from '../config'
import BardQuery, { QueryStatus } from './BardQuery'

interface Props {
  question: string
  promptSource: string
  triggerMode: TriggerMode
  onStatusChange?: (status: QueryStatus) => void
}

function BardCard(props: Props) {
  const [triggered, setTriggered] = useState(false)

  if (props.triggerMode === TriggerMode.Always) {
    return <BardQuery {...props} />
  }
  if (triggered) {
    return <BardQuery {...props} />
  }
  return (
    <p className="icon-and-text cursor-pointer" onClick={() => setTriggered(true)}>
      <SearchIcon size="small" /> Ask CPBARD to help
    </p>
  )
}

export default BardCard
