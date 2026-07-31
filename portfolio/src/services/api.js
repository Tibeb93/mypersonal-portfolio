import axios from 'axios'

// Use env var if set (Vercel dashboard), otherwise use the deployed backend
const BASE_URL = import.meta.env.VITE_API_URL || 'https://portfolio-backend-jwdp.onrender.com/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Response interceptor — unwrap data or throw cleanly ──────────────────────
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.message ||
      'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  }
)

// ── Public endpoints ─────────────────────────────────────────────────────────
export const profileAPI = {
  get: () => api.get('/profile'),
}

export const skillsAPI = {
  getAll: (category) =>
    api.get('/skills', { params: category ? { category } : {} }),
}

export const projectsAPI = {
  getAll:    (params) => api.get('/projects', { params }),
  getBySlug: (slug)   => api.get(`/projects/${slug}`),
}

export const experienceAPI = {
  getAll: () => api.get('/experience'),
}

export const educationAPI = {
  getAll: () => api.get('/education'),
}

export const certificatesAPI = {
  getAll: () => api.get('/certificates'),
}

export const blogAPI = {
  getAll:       (params) => api.get('/blog', { params }),
  getBySlug:    (slug)   => api.get(`/blog/${slug}`),
  getCategories:()       => api.get('/blog/categories'),
  getTags:      ()       => api.get('/blog/tags'),
}

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
}

export const settingsAPI = {
  getPublic: () => api.get('/settings/public'),
}

export const aboutAPI = {
  get: () => api.get('/about'),
}

// Track page view (fire-and-forget)
export const trackView = (page) =>
  api.post('/analytics/pageview', { page }).catch(() => {})

export default api
