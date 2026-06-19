import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchConversations,
  setActiveUser,
  fetchConversation,
} from '@/redux/slices/chatSlice'
import { useAuth } from '@/hooks/useAuth'

import { getInitials } from '@/utils/validators'
import Loader from '@/components/common/Loader'
import clsx from 'clsx'

export default function ChatSidebar() {
  const dispatch = useDispatch()

  const {
    conversations,
    activeUserId,
    loading,
  } = useSelector((s) => s.chat)

  useEffect(() => {
    dispatch(fetchConversations())
  }, [dispatch])

  const { user } = useAuth()

  const openConversation = (
    partnerId,
    partnerName
  ) => {

    dispatch(
      setActiveUser(partnerId)
    )

    dispatch(
      fetchConversation({
        userId: partnerId,
        partnerName,
      })
    )
  }

  /* ---------------------------------- */
  /* Conversations list filter          */
  /* Keep conversations that have a real partner id and name. */
  /* Previous code filtered out partners named 'Tenant' which
     could hide valid owner conversations using generic names. */

  const validConversations =
    conversations.filter(
      (conv) =>
        conv?.partner?.id &&
        conv?.partner?.fullName &&
        String(conv.partner.id) !== String(user?.id)
    )

  return (
    <div className="w-full md:w-72 border-r border-stone-100 bg-white flex flex-col">

      {/* Header */}

      <div className="px-4 py-4 border-b border-stone-100">
        <h2 className="font-semibold text-stone-900">
          Messages
        </h2>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-stone-50">

          {validConversations.length === 0 && (
            <div className="text-center py-12 text-stone-400 text-sm">
              No conversations yet
            </div>
          )}

          {validConversations.map(
            (conv) => {

              const partner =
                conv.partner

              const isActive =
                String(
                  activeUserId
                ) ===
                String(
                  partner?.id
                )

              return (
                <button
                  key={
                    partner?.id
                  }
                  onClick={() =>
                    openConversation(
                      partner?.id,
                      partner?.fullName
                    )
                  }
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors text-left',
                    isActive &&
                      'bg-primary-50'
                  )}
                >

                  {/* Avatar */}

                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-sm shrink-0">
                    {getInitials(
                      partner?.fullName
                    )}
                  </div>

                  {/* Name */}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-900 text-sm truncate">
                      {
                        partner?.fullName
                      }
                    </p>
                  </div>

                  {/* Show unseen count only if >0 */}

                  {Number(
                    conv.unreadCount
                  ) > 0 && (
                    <span className="min-w-[20px] h-5 px-1 bg-primary-500 text-white text-[10px] rounded-full flex items-center justify-center shrink-0">
                      {
                        conv.unreadCount
                      }
                    </span>
                  )}
                </button>
              )
            }
          )}
        </div>
      )}
    </div>
  )
}
