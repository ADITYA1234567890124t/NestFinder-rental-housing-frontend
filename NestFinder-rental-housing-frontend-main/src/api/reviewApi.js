import api from './axiosConfig'

const reviewApi = {
  add:           (data)         => api.post('/reviews', data),
  update:        (id, data)     => api.put(`/reviews/${id}`, data),
  delete:        (id)           => api.delete(`/reviews/${id}`),
  getByProperty: (pid, params)  => api.get(`/reviews/property/${pid}`, { params }),
  getMyReviews:  (params)       => api.get('/reviews/my-reviews', { params }),
}

export default reviewApi
