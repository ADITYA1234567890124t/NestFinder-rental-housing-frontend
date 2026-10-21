import bookingApi from '@/api/bookingApi'
export const bookingService = {
  create:        (data)       => bookingApi.create(data).then(r => r.data.data),
  getMyBookings: (params)     => bookingApi.getMyBookings(params).then(r => r.data.data),
  getReceived:   (params)     => bookingApi.getReceived(params).then(r => r.data.data),
  updateStatus:  (id, data)   => bookingApi.updateStatus(id, data).then(r => r.data.data),
  cancel:        (id)         => bookingApi.cancel(id).then(r => r.data),
}
