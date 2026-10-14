import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  register: (data) => client.post('/auth/register', data),
  login: (data) => client.post('/auth/login', data),
}

export const repoApi = {
  list: () => client.get('/repositories'),
  add: (data) => client.post('/repositories', data),
  get: (id) => client.get(`/repositories/${id}`),
  remove: (id) => client.delete(`/repositories/${id}`),
}

export const reviewApi = {
  create: (repositoryId) => client.post('/reviews', { repositoryId }),
  createFromPaste: (data) => client.post('/reviews/paste', data),
  listForRepo: (repositoryId) => client.get('/reviews', { params: { repositoryId } }),
  get: (id) => client.get(`/reviews/${id}`),
  issues: (id) => client.get(`/reviews/${id}/issues`),
}

export default client
