import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import ChatSidebar from '@/components/chat/ChatSidebar'
import ChatBox     from '@/components/chat/ChatBox'
import { MessageCircle } from 'lucide-react'
import { fetchConversation, setActiveUser } from '@/redux/slices/chatSlice'

export default function ChatPage() {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const { activeUserId, conversations } = useSelector(s => s.chat)
  const queryUserId = searchParams.get('userId')
  const queryName = searchParams.get('name')

  useEffect(() => {
    if (!queryUserId) return
    const receiverId = Number.isNaN(Number(queryUserId)) ? queryUserId : Number(queryUserId)
    dispatch(setActiveUser(receiverId))
    dispatch(fetchConversation({ userId: receiverId, partnerName: queryName || 'User' }))
  }, [dispatch, queryUserId, queryName])

  // Find active conversation partner name
  const activeConv   = conversations.find(c => String(c.partner?.id) === String(activeUserId))
  const receiverName = activeConv?.partner?.fullName || queryName || 'User'

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-stone-900 mb-6">Messages</h1>

      <div className="card overflow-hidden" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        <div className="flex h-full">
          {/* Sidebar */}
          <ChatSidebar />

          {/* Chat area */}
          {activeUserId ? (
            <ChatBox
              receiverId={activeUserId}
              receiverName={receiverName}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-stone-400">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-stone-300" />
              </div>
              <p className="font-medium text-stone-500">Select a conversation</p>
              <p className="text-sm mt-1">Choose from your conversations on the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
