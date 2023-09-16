import { useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import { fetchPromotion } from '../api'
import { TriggerMode } from '../config'
import BardCard from './BardCard'
import { QueryStatus } from './BardQuery'

interface Props {
  question: string
  promptSource: string
  triggerMode: TriggerMode
}

function BardContainer(props: Props) {
  const [queryStatus, setQueryStatus] = useState<QueryStatus>()
  const query = useSWRImmutable(
    queryStatus === 'success' ? 'promotion' : undefined,
    fetchPromotion,
    { shouldRetryOnError: false },
  )
  return (
    <>
      <div className="chat-gpt-card">
        <BardCard
          question={props.question}
          promptSource={props.promptSource}
          triggerMode={props.triggerMode}
          onStatusChange={setQueryStatus}
        />
      </div>
    </>
  )
}

export default BardContainer
