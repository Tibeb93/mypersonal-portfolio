import PageView from '../models/Analytics.js'
import Project from '../models/Project.js'
import Blog from '../models/Blog.js'
import ContactMessage from '../models/ContactMessage.js'
import Skill from '../models/Skill.js'
import Experience from '../models/Experience.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'

// GET /api/admin/analytics/overview
export const getOverview = async (req, res) => {
  try {
    const [
      totalProjects,
      totalBlogs,
      totalMessages,
      unreadMessages,
      totalSkills,
      totalExperiences,
      totalViews,
    ] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments({ status: 'published' }),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ status: 'unread' }),
      Skill.countDocuments(),
      Experience.countDocuments(),
      PageView.countDocuments(),
    ])

    sendSuccess(res, {
      totalProjects,
      totalBlogs,
      totalMessages,
      unreadMessages,
      totalSkills,
      totalExperiences,
      totalViews,
    })
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/admin/analytics/visitors?days=30
export const getVisitorStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30
    const since = new Date()
    since.setDate(since.getDate() - days)

    const stats = await PageView.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          visits: { $sum: 1 },
          uniquePages: { $addToSet: '$page' },
        },
      },
      {
        $project: {
          date: '$_id',
          visits: 1,
          uniquePages: { $size: '$uniquePages' },
          _id: 0,
        },
      },
      { $sort: { date: 1 } },
    ])

    sendSuccess(res, { stats, days })
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/admin/analytics/top-pages
export const getTopPages = async (req, res) => {
  try {
    const pages = await PageView.aggregate([
      { $group: { _id: '$page', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 },
      { $project: { page: '$_id', views: 1, _id: 0 } },
    ])

    sendSuccess(res, { pages })
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/admin/analytics/projects  (project view counts)
export const getProjectStats = async (req, res) => {
  try {
    const projects = await Project.find()
      .select('title views featured')
      .sort({ views: -1 })
      .limit(10)

    sendSuccess(res, { projects })
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/admin/analytics/contact-activity?days=30
export const getContactActivity = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30
    const since = new Date()
    since.setDate(since.getDate() - days)

    const activity = await ContactMessage.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $project: { date: '$_id', count: 1, _id: 0 } },
      { $sort: { date: 1 } },
    ])

    sendSuccess(res, { activity, days })
  } catch (err) {
    sendError(res, err.message)
  }
}
