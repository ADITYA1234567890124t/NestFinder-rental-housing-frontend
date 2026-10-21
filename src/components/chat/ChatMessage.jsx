import { formatTime } from '@/utils/dateFormatter'
import { useSelector } from 'react-redux'
import clsx from 'clsx'

export default function ChatMessage({ message }) {
  const { user } = useSelector(s => s.auth)
  const isMine = message.sender?.id === user?.id || message.senderId === user?.id || message.senderEmail === user?.email

  return (
    <div className={clsx('flex mb-3', isMine ? 'justify-end' : 'justify-start')}>
      <div className={clsx('max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
        isMine
          ? 'bg-primary-500 text-white rounded-br-sm'
          : 'bg-stone-100 text-stone-800 rounded-bl-sm')}>
        <p>{message.content}</p>
        <p className={clsx('text-[10px] mt-1', isMine ? 'text-primary-200' : 'text-stone-400')}>
          {formatTime(message.sentAt || message.timestamp || message.createdAt)}
          {message.isRead && isMine && ' - Read'}
        </p>
      </div>
    </div>
  )
}
