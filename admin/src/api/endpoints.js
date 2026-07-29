import api from './client.js'

// ── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  login:           (data)   => api.post('/auth/login', data),
  logout:          ()       => api.post('/auth/logout'),
  refresh:         ()       => api.post('/auth/refresh'),
  me:              ()       => api.get('/auth/me'),
  changePassword:  (data)   => api.put('/auth/change-password', data),
  updateProfile:   (data)   => api.put('/auth/profile', data),
}

// ── Profile ───────────────────────────────────────────────────────────────
export const profileAPI = {
  get:          () => api.get('/admin/profile'),
  update:       (data) => api.put('/admin/profile', data),
  uploadImage:  (form) => api.post('/admin/profile/image',  form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadResume: (form) => api.post('/admin/profile/resume', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

// ── Skills ────────────────────────────────────────────────────────────────
export const skillsAPI = {
  getAll:   ()       => api.get('/admin/skills/all'),
  create:   (data)   => api.post('/admin/skills', data),
  update:   (id, data) => api.put(`/admin/skills/${id}`, data),
  delete:   (id)     => api.delete(`/admin/skills/${id}`),
  reorder:  (order)  => api.put('/admin/skills/reorder', { order }),
}

// ── Projects ──────────────────────────────────────────────────────────────
export const projectsAPI = {
  getAll:           (params) => api.get('/admin/projects/admin/all', { params }),
  create:           (data)   => api.post('/admin/projects', data),
  update:           (id, data) => api.put(`/admin/projects/${id}`, data),
  delete:           (id)     => api.delete(`/admin/projects/${id}`),
  reorder:          (order)  => api.put('/admin/projects/reorder', { order }),
  uploadThumbnail:  (id, form) => api.post(`/admin/projects/${id}/thumbnail`,  form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  addScreenshot:    (id, form) => api.post(`/admin/projects/${id}/screenshots`, form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteScreenshot: (id, publicId) => api.delete(`/admin/projects/${id}/screenshots/${publicId}`),
}

// ── Experience ────────────────────────────────────────────────────────────
export const experienceAPI = {
  getAll:     ()         => api.get('/admin/experience/all'),
  create:     (data)     => api.post('/admin/experience', data),
  update:     (id, data) => api.put(`/admin/experience/${id}`, data),
  delete:     (id)       => api.delete(`/admin/experience/${id}`),
  uploadLogo: (id, form) => api.post(`/admin/experience/${id}/logo`, form, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

// ── Education ─────────────────────────────────────────────────────────────
export const educationAPI = {
  getAll:  ()         => api.get('/admin/education/all'),
  create:  (data)     => api.post('/admin/education', data),
  update:  (id, data) => api.put(`/admin/education/${id}`, data),
  delete:  (id)       => api.delete(`/admin/education/${id}`),
}

// ── Certificates ──────────────────────────────────────────────────────────
export const certificatesAPI = {
  getAll:      ()         => api.get('/admin/certificates/all'),
  create:      (data)     => api.post('/admin/certificates', data),
  update:      (id, data) => api.put(`/admin/certificates/${id}`, data),
  delete:      (id)       => api.delete(`/admin/certificates/${id}`),
  uploadImage: (id, form) => api.post(`/admin/certificates/${id}/image`, form, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

// ── Blog ──────────────────────────────────────────────────────────────────
export const blogAPI = {
  getAll:   (params)   => api.get('/admin/blog/admin/all', { params }),
  getById:  (id)       => api.get(`/admin/blog/admin/${id}`),
  create:   (data)     => api.post('/admin/blog', data),
  update:   (id, data) => api.put(`/admin/blog/${id}`, data),
  delete:   (id)       => api.delete(`/admin/blog/${id}`),
  uploadCover: (id, form) => api.post(`/admin/blog/${id}/cover`, form, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

// ── Contact ───────────────────────────────────────────────────────────────
export const contactAPI = {
  getAll:        (params) => api.get('/admin/contact', { params }),
  getOne:        (id)     => api.get(`/admin/contact/${id}`),
  updateStatus:  (id, status) => api.put(`/admin/contact/${id}/status`, { status }),
  delete:        (id)     => api.delete(`/admin/contact/${id}`),
  bulkDelete:    (ids)    => api.delete('/admin/contact/bulk', { data: { ids } }),
  getStats:      ()       => api.get('/admin/contact/stats'),
}

// ── Media ─────────────────────────────────────────────────────────────────
export const mediaAPI = {
  getAll:   (params) => api.get('/admin/media', { params }),
  upload:   (form)   => api.post('/admin/media', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:   (id, data) => api.put(`/admin/media/${id}`, data),
  delete:   (id)     => api.delete(`/admin/media/${id}`),
}

// ── Settings ──────────────────────────────────────────────────────────────
export const settingsAPI = {
  get:           ()     => api.get('/admin/settings'),
  update:        (data) => api.put('/admin/settings', data),
  uploadLogo:    (form) => api.post('/admin/settings/logo',    form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadFavicon: (form) => api.post('/admin/settings/favicon', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

// ── Analytics ─────────────────────────────────────────────────────────────
export const analyticsAPI = {
  overview:        ()       => api.get('/admin/analytics/overview'),
  visitors:        (days)   => api.get('/admin/analytics/visitors',         { params: { days } }),
  topPages:        ()       => api.get('/admin/analytics/top-pages'),
  projectStats:    ()       => api.get('/admin/analytics/projects'),
  contactActivity: (days)   => api.get('/admin/analytics/contact-activity', { params: { days } }),
}

// ── Audit Log ─────────────────────────────────────────────────────────────
export const auditAPI = {
  getAll:    (params) => api.get('/admin/audit-log', { params }),
  clearOld:  (days)   => api.delete('/admin/audit-log/clear', { params: { days } }),
}
