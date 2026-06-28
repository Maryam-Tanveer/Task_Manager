import axios from 'axios'

let baseURL = process.env.REACT_APP_API_URL || '/api';

// Normalize URL: Ensure it ends with '/api' to match backend routes mount point
if (baseURL && !baseURL.endsWith('/api') && !baseURL.endsWith('/api/')) {
  baseURL = baseURL.replace(/\/$/, '') + '/api';
}

const api = axios.create({
  baseURL: baseURL
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api