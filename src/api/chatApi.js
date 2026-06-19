import api from './axiosConfig'

const chatApi = {
  send:           (data)     => api.post('/messages', data),
  getConversation:(userId)   => api.get(`/messages/conversation/${userId}`),
  getList:        ()         => api.get('/messages/conversations'),
  markRead:       (senderId) => api.patch(`/messages/read/${senderId}`),
  getUnreadCount: ()         => api.get('/messages/unread-count'),
}

export default chatApi
