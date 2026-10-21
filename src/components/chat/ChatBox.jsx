import { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import {
  sendMessage,
  addIncomingMessage,
  fetchConversation,
} from '@/redux/slices/chatSlice'
import { tokenHelper } from '@/utils/tokenHelper'
import ChatMessage from './ChatMessage'
import { Send, Loader2 } from 'lucide-react'
import { getInitials } from '@/utils/validators'
import toast from 'react-hot-toast'
import { formatChatDate, getDateKey } from '@/utils/dateFormatter'

export default function ChatBox({
  receiverId,
  receiverName,
}) {

  const dispatch =
    useDispatch()

  const {
    messages,
    loading,
  } = useSelector(
    (s) => s.chat
  )

  const { user } =
    useSelector(
      (s) => s.auth
    )

  const [text, setText] =
    useState('')

  const [sending, setSending] =
    useState(false)

  const [typing, setTyping] =
    useState(false)

  const bottomRef =
    useRef(null)

  const clientRef =
    useRef(null)

  /* -------------------------------- */
  /* Auto Scroll                      */
  /* -------------------------------- */

  useEffect(() => {

    bottomRef.current
      ?.scrollIntoView({
        behavior: 'smooth',
      })

  }, [messages])

  /* -------------------------------- */
  /* Load Conversation                */
  /* -------------------------------- */

  useEffect(() => {

    if (!receiverId) {
      return
    }

    dispatch(
      fetchConversation({
        userId:
          receiverId,
        partnerName:
          receiverName,
      })
    )

  }, [
    receiverId,
    receiverName,
    dispatch,
  ])

  /* -------------------------------- */
  /* WebSocket Setup                  */
  /* -------------------------------- */

  useEffect(() => {

    if (
      !user ||
      !receiverId
    ) {
      return
    }

    const token =
      tokenHelper.getToken()

    if (!token) {
      return
    }

    const socketUrl =
      import.meta.env
        .VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/ws`
        : 'http://localhost:8080/ws'

    const client =
      new Client({

        webSocketFactory:
          () =>
            new SockJS(
              socketUrl
            ),

        reconnectDelay:
          5000,

        debug: () => {},

        connectHeaders: {
          Authorization:
            `Bearer ${token}`,
        },

        onConnect:
          () => {

            console.log(
              'WebSocket Connected'
            )

            /* Subscribe user queue */

            client.subscribe(
              '/user/queue/messages',

              (message) => {

                const payload =
                  JSON.parse(
                    message.body
                  )

                console.log(
                  'Incoming:',
                  payload
                )

                /* Ignore own sent messages */
                if (
                  String(
                    payload.senderId
                  ) ===
                  String(
                    user.id
                  )
                ) {
                  return
                }

                /* Add real-time msg */
                dispatch(
                  addIncomingMessage(
                    payload
                  )
                )

                /* Refresh active chat */
                if (
                  String(
                    payload.senderId
                  ) ===
                  String(
                    receiverId
                  )
                ) {

                  dispatch(
                    fetchConversation({
                      userId:
                        receiverId,
                      partnerName:
                        receiverName,
                    })
                  )
                }

                /* Typing indicator */

                if (
                  payload.type ===
                  'TYPING'
                ) {

                  if (
                    String(
                      payload.senderId
                    ) ===
                    String(
                      receiverId
                    )
                  ) {

                    setTyping(
                      payload.typing
                    )

                    setTimeout(
                      () =>
                        setTyping(
                          false
                        ),
                      2000
                    )
                  }
                }
              }
            )
          },

        onStompError:
          (frame) => {

            console.error(
              'STOMP ERROR',
              frame
            )
          },

        onWebSocketError:
          (err) => {

            console.error(
              'Socket Error',
              err
            )
          },
      })

    client.activate()

    clientRef.current =
      client

    return () => {

      if (
        clientRef.current
      ) {

        clientRef.current
          .deactivate()
      }
    }

  }, [
    receiverId,
    receiverName,
    user,
    dispatch,
  ])

  /* -------------------------------- */
  /* Send Message                     */
  /* -------------------------------- */

  const handleSend =
    async (e) => {

      e.preventDefault()

      if (
        !text.trim()
        || sending
      ) {
        return
      }

      setSending(true)

      const content =
        text.trim()

      const result =
        await dispatch(
          sendMessage({

            receiverId,

            receiverName,

            content,
          })
        )

      if (
        result.meta
          .requestStatus !==
        'fulfilled'
      ) {

        toast.error(
          result.payload ||
          'Failed to send message'
        )

        setSending(false)

        return
      }

      setText('')

      setSending(false)

      /* Refresh chat instantly */

      dispatch(
        fetchConversation({
          userId:
            receiverId,
          partnerName:
            receiverName,
        })
      )
    }

  /* -------------------------------- */
  /* Empty State                      */
  /* -------------------------------- */

  if (!receiverId) {

    return (
      <div className="flex-1 flex items-center justify-center text-stone-400">

        <div className="text-center">

          <p className="text-lg font-medium">
            Select a conversation
          </p>

          <p className="text-sm mt-1">
            Choose someone to chat with
          </p>

        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">

      {/* Header */}

      <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-3 bg-white">

        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold">

          {getInitials(
            receiverName
          )}

        </div>

        <div>

          <p className="font-semibold text-sm text-stone-900">
            {receiverName}
          </p>

          {typing && (

            <p className="text-xs text-primary-500 animate-pulse">

              typing...

            </p>
          )}
        </div>
      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto px-5 py-4">

        {loading ? (

          <div className="flex justify-center py-8">

            <Loader2 className="w-6 h-6 animate-spin text-primary-500" />

          </div>

        ) : (

          <>
            {(() => {
              let previousDateKey = null

              return messages.map((msg, index) => {
                const messageDate = msg.sentAt || msg.timestamp || msg.createdAt
                const dateKey = getDateKey(messageDate)
                const showDate = dateKey !== previousDateKey
                previousDateKey = dateKey

                return (
                  <Fragment key={msg.id || `${dateKey}-${index}`}>
                    {showDate && (
                      <div className="flex justify-center my-4">
                        <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-500 text-[11px] font-medium">
                          {formatChatDate(messageDate)}
                        </span>
                      </div>
                    )}
                    <ChatMessage message={msg} />
                  </Fragment>
                )
              })
            })()}

            <div
              ref={bottomRef}
            />
          </>
        )}
      </div>

      {/* Input */}

      <form
        onSubmit={
          handleSend
        }
        className="px-4 py-3 border-t border-stone-100 bg-white flex gap-2"
      >

        <input
          value={text}
          onChange={(e) =>
            setText(
              e.target.value
            )
          }
          placeholder="Type a message..."
          className="input flex-1"
        />

        <button
          type="submit"
          disabled={
            !text.trim()
            || sending
          }
          className="btn btn-primary px-4"
        >

          {sending ? (

            <Loader2 className="w-4 h-4 animate-spin" />

          ) : (

            <Send className="w-4 h-4" />

          )}
        </button>
      </form>
    </div>
  )
}
