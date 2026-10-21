import api from './axiosConfig'

const authApi = {
  register:     (data)        => api.post('/auth/register', data),
  login:        (data)        => api.post('/auth/login', data),
  refreshToken: (token)       => api.post('/auth/refresh', null, { headers: { 'Refresh-Token': token } }),
  logout:       ()            => api.post('/auth/logout'),
}

export default authApi
