  import api from './axiosConfig'

  const favoriteApi = {
    add:    (propertyId) => api.post(`/favorites/${propertyId}`),
    remove: (propertyId) => api.delete(`/favorites/${propertyId}`),
    getAll: (params)     => api.get('/favorites', { params }),
    check:  (propertyId) => api.get(`/favorites/${propertyId}/check`),
  }

  export default favoriteApi
