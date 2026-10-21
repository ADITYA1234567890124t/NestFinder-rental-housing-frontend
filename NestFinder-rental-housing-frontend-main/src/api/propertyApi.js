import api from './axiosConfig'

const propertyApi = {
  getAll:         (params)          => api.get('/properties', { params }),
  getById:        (id)              => api.get(`/properties/${id}`),
  getByOwner:     (ownerId, params) => api.get(`/properties/owner/${ownerId}`, { params }),
  create:         (data)            => api.post('/properties', data),
  update:         (id, data)        => api.put(`/properties/${id}`, data),
  delete:         (id)              => api.delete(`/properties/${id}`),
  uploadImages:   (id, formData)    => api.post(`/properties/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteImage:    (pid, imgId)      => api.delete(`/properties/${pid}/images/${imgId}`),
  toggleAvail:    (id)              => api.patch(`/properties/${id}/toggle-availability`),
  verify:         (id)              => api.patch(`/properties/${id}/verify`),
  getPending:     (params)          => api.get('/properties/pending-verification', { params }),
  search:         (params)          => api.get('/search/properties', { params }),
  fullTextSearch: (query, params)   => api.get('/search/full-text', { params: { query, ...params } }),
}

export default propertyApi
