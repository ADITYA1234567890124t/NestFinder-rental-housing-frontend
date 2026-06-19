import api from './axiosConfig'

const complaintApi = {
  create:       (data)       => api.post('/complaints', data),
  getMine:      (params)     => api.get('/complaints/my-complaints', { params }),
  getById:      (id)         => api.get(`/complaints/${id}`),
  getAll:       (params)     => api.get('/complaints', { params }),
  updateStatus: (id, data)   => api.patch(`/complaints/${id}/status`, data),
}

export default complaintApi
