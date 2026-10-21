import api from './axiosConfig'

const paymentApi = {
  initiate:          (data)         => api.post('/payments/initiate', data),
  confirm:           (data)         => api.post('/payments/confirm', data),
  getById:           (id)           => api.get(`/payments/${id}`),
  getMyPayments:     (params)       => api.get('/payments/my-payments', { params }),
  getBookingPayments:(id, params)   => api.get(`/payments/booking/${id}`, { params }),
  getEarnings:       ()             => api.get('/payments/my-earnings'),
  refund:            (id)           => api.post(`/payments/${id}/refund`),
}

export default paymentApi
