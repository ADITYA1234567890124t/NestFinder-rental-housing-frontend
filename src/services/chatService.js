import chatApi from '@/api/chatApi'
export const chatService = {
  send:           (data)     => chatApi.send(data).then(r => r.data.data),
  getConversation:(userId)   => chatApi.getConversation(userId).then(r => r.data.data),
  getList:        ()         => chatApi.getList().then(r => r.data.data),
  markRead:       (senderId) => chatApi.markRead(senderId).then(r => r.data),
  getUnreadCount: ()         => chatApi.getUnreadCount().then(r => r.data.data?.unreadCount ?? 0),
}
