import api from './axiosConfig'

const bookingApi = {
  create:         (data)         => api.post('/bookings', data),
  getAll:         (params)       => api.get('/bookings', { params }),
  getById:        (id)           => api.get(`/bookings/${id}`),
  getMyBookings:  (params)       => api.get('/bookings/my-bookings', { params }),
  getReceived:    (params)       => api.get('/bookings/received', { params }),
  getByProperty:  (pid, params)  => api.get(`/bookings/property/${pid}`, { params }),
  updateStatus:   (id, data)     => api.patch(`/bookings/${id}/status`, data),
  cancel:         (id)           => api.patch(`/bookings/${id}/cancel`),
}

export default bookingApi
