import PageView from '../models/Analytics.js'

/**
 * Track public page views — non-blocking, fire-and-forget
 */
export const trackPageView = (page) => async (req, res, next) => {
  try {
    PageView.create({
      page,
      ip:        req.ip,
      userAgent: req.headers['user-agent'],
      referrer:  req.headers.referer || null,
      sessionId: req.headers['x-session-id'] || null,
    }).catch(() => {}) // silently ignore errors
  } catch (_) {}
  next()
}

/**
 * Track project view by incrementing the counter
 */
export const incrementProjectView = async (projectId) => {
  const Project = (await import('../models/Project.js')).default
  await Project.findByIdAndUpdate(projectId, { $inc: { views: 1 } }).catch(() => {})
}

/**
 * Track blog post view
 */
export const incrementBlogView = async (blogId) => {
  const Blog = (await import('../models/Blog.js')).default
  await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } }).catch(() => {})
}
