import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import chatApi from '@/api/chatApi'

const responseData = (response) => {
  const body = response?.data ?? response
  return body?.data?.data ?? body?.data ?? body
}

const sameId = (a, b) =>
  a != null &&
  b != null &&
  String(a) === String(b)

/* ===================================== */
/* Fetch Conversations                   */
/* ===================================== */

export const fetchConversations =
  createAsyncThunk(
    'chat/fetchList',
    async (_, { rejectWithValue }) => {
      try {
        const response =
          await chatApi.getList()

        return responseData(response)
      } catch (e) {
        return rejectWithValue(
          e.response?.data?.message ||
            'Failed to load conversations'
        )
      }
    }
  )

/* ===================================== */
/* Fetch Messages                        */
/* ===================================== */

export const fetchConversation =
  createAsyncThunk(
    'chat/fetchConversation',
    async (payload, { rejectWithValue }) => {
      const userId =
        typeof payload === 'object'
          ? payload.userId
          : payload

      const partnerName =
        typeof payload === 'object'
          ? payload.partnerName
          : 'User'

      try {
        const response =
          await chatApi.getConversation(
            userId
          )

        let unreadCount
        try {
          await chatApi.markRead(userId)
          unreadCount = responseData(await chatApi.getUnreadCount())?.unreadCount ?? 0
        } catch {
          unreadCount = null
        }

        return {
          userId,
          partnerName,
          messages:
            responseData(response),
          unreadCount,
        }
      } catch (e) {
        return rejectWithValue(
          e.response?.data?.message ||
            'Failed to load messages'
        )
      }
    }
  )

/* ===================================== */
/* Send Message                          */
/* ===================================== */

export const sendMessage =
  createAsyncThunk(
    'chat/send',
    async (
      payload,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await chatApi.send({
            receiverId:
              payload.receiverId,

            content:
              payload.content,
          })

        return responseData(response)
      } catch (e) {
        return rejectWithValue(
          e.response?.data?.message ||
            'Failed to send message'
        )
      }
    }
  )

/* ===================================== */
/* Unread Count                          */
/* ===================================== */

export const fetchUnreadCount =
  createAsyncThunk(
    'chat/unread',
    async (_, { rejectWithValue }) => {
      try {
        const response =
          await chatApi.getUnreadCount()

        const payload =
          responseData(response)

        return (
          payload?.unreadCount ??
          0
        )
      } catch (e) {
        return rejectWithValue(
          e.response?.data?.message ||
            'Failed to load unread count'
        )
      }
    }
  )

/* ===================================== */
/* Slice                                 */
/* ===================================== */

const chatSlice =
  createSlice({
    name: 'chat',

    initialState: {
      conversations: [],
      messages: [],
      activeUserId: null,
      unreadCount: 0,
      loading: false,
      error: null,
    },

    reducers: {
      setActiveUser:
        (state, action) => {
          state.activeUserId =
            action.payload
        },

      clearMessages:
        (state) => {
          state.messages = []
        },

      addIncomingMessage:
        (state, action) => {
          const message =
            action.payload

          const senderId =
            message.senderId

          const receiverId =
            message.receiverId

          const partnerId =
            sameId(
              senderId,
              state.activeUserId
            )
              ? senderId
              : senderId

          /* Add to current chat */
          const shouldShow =
            sameId(
              senderId,
              state.activeUserId
            ) ||
            sameId(
              receiverId,
              state.activeUserId
            )

          if (shouldShow) {
            state.messages.push(
              message
            )
          }

          /* Sidebar conversation */
          const existing =
            state.conversations.find(
              (c) =>
                sameId(
                  c.partner?.id,
                  partnerId
                )
            )

          if (existing) {
            existing.lastMessage =
              message

            if (
              !sameId(
                state.activeUserId,
                senderId
              )
            ) {
              existing.unreadCount =
                (existing.unreadCount ||
                  0) + 1

              state.unreadCount += 1
            }

            state.conversations = [
              existing,
              ...state.conversations.filter(
                (c) =>
                  !sameId(
                    c.partner?.id,
                    partnerId
                  )
              ),
            ]
          } else {
            state.conversations.unshift(
              {
                partner: {
                  id: senderId,
                  fullName:
                    message.senderName ||
                    'User',
                },
                lastMessage:
                  message,
                unreadCount: 1,
              }
            )
          }
        },
    },

    extraReducers: (builder) => {
      builder

        /* ========================== */
        /* Conversations              */
        /* ========================== */

        .addCase(
          fetchConversations.pending,
          (state) => {
            state.loading = true
            state.error = null
          }
        )

        .addCase(
          fetchConversations.fulfilled,
          (state, action) => {
            state.loading = false
            state.conversations =
              action.payload
          }
        )

        .addCase(
          fetchConversations.rejected,
          (state, action) => {
            state.loading = false
            state.error =
              action.payload
          }
        )

        /* ========================== */
        /* Messages                   */
        /* ========================== */

        .addCase(
          fetchConversation.pending,
          (state) => {
            state.loading = true
          }
        )

        .addCase(
          fetchConversation.fulfilled,
          (state, action) => {
            state.loading = false

            state.messages =
              action.payload.messages

            state.activeUserId =
              action.payload.userId

            const conversation =
              state.conversations.find(
                (c) =>
                  sameId(
                    c.partner?.id,
                    action.payload
                      .userId
                  )
              )

            if (conversation) {
              state.unreadCount =
                action.payload.unreadCount == null
                  ? Math.max(
                      0,
                      state.unreadCount -
                        (conversation.unreadCount ||
                          0)
                    )
                  : action.payload.unreadCount

              conversation.unreadCount =
                0
            } else if (action.payload.unreadCount != null) {
              state.unreadCount = action.payload.unreadCount
            }
          }
        )

        .addCase(
          fetchConversation.rejected,
          (state, action) => {
            state.loading = false
            state.error =
              action.payload
          }
        )

        /* ========================== */
        /* Send Message               */
        /* ========================== */

        .addCase(
          sendMessage.fulfilled,
          (state, action) => {
            state.messages.push(
              action.payload
            )
          }
        )

        /* ========================== */
        /* Unread Count               */
        /* ========================== */

        .addCase(
          fetchUnreadCount.fulfilled,
          (state, action) => {
            state.unreadCount =
              action.payload
          }
        )
    },
  })

export const {
  setActiveUser,
  addIncomingMessage,
  clearMessages,
} = chatSlice.actions

export default chatSlice.reducer
