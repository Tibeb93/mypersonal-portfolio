import PageView from '../models/Analytics.js'
import Project from '../models/Project.js'
import Blog from '../models/Blog.js'
import ContactMessage from '../models/ContactMessage.js'
import Skill from '../models/Skill.js'
import Experience from '../models/Experience.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'
import { parseUserAgent, extractReferrerDomain } from '../utils/userAgent.js'

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

// GET /api/admin/analytics/recent-visitors?limit=50
export const getRecentVisitors = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200)

    const visitors = await PageView.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    const enriched = visitors.map((v) => {
      const ua = parseUserAgent(v.userAgent)
      return {
        _id: v._id,
        page: v.page,
        ip: v.ip || 'Unknown',
        browser: ua.browser,
        browserVersion: ua.browserVersion,
        os: ua.os,
        device: ua.device,
        referrer: extractReferrerDomain(v.referrer),
        sessionId: v.sessionId,
        timestamp: v.createdAt,
      }
    })

    sendSuccess(res, { visitors: enriched })
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/admin/analytics/visitor-summary?days=30
export const getVisitorSummary = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30
    const since = new Date()
    since.setDate(since.getDate() - days)

    const [totalVisits, uniqueIps, browsers, osStats, devices, referrers, hourlyTraffic] = await Promise.all([
      PageView.countDocuments({ createdAt: { $gte: since } }),
      PageView.distinct('ip', { createdAt: { $gte: since } }).then(ips => ips.filter(Boolean).length),
      PageView.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: '$userAgent', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]).then(results => {
        const browserMap = {}
        for (const r of results) {
          const ua = parseUserAgent(r._id)
          const key = ua.browser
          browserMap[key] = (browserMap[key] || 0) + r.count
        }
        return Object.entries(browserMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
      }),
      PageView.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: '$userAgent', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]).then(results => {
        const osMap = {}
        for (const r of results) {
          const ua = parseUserAgent(r._id)
          osMap[ua.os] = (osMap[ua.os] || 0) + r.count
        }
        return Object.entries(osMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
      }),
      PageView.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: '$userAgent', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]).then(results => {
        const deviceMap = {}
        for (const r of results) {
          const ua = parseUserAgent(r._id)
          deviceMap[ua.device] = (deviceMap[ua.device] || 0) + r.count
        }
        return Object.entries(deviceMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
      }),
      PageView.aggregate([
        { $match: { createdAt: { $gte: since }, referrer: { $ne: null } } },
        { $project: { referrer: 1 } },
        { $limit: 500 },
      ]).then(results => {
        const refMap = {}
        for (const r of results) {
          const domain = extractReferrerDomain(r.referrer)
          if (domain) refMap[domain] = (refMap[domain] || 0) + 1
        }
        return Object.entries(refMap)
          .map(([domain, count]) => ({ domain, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
      }),
      PageView.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: { hour: { $hour: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $project: { hour: '$_id.hour', count: 1, _id: 0 } },
        { $sort: { hour: 1 } },
      ]),
    ])

    sendSuccess(res, {
      totalVisits,
      uniqueVisitors: uniqueIps,
      browsers,
      operatingSystems: osStats,
      devices,
      topReferrers: referrers,
      hourlyTraffic,
      days,
    })
  } catch (err) {
    sendError(res, err.message)
  }
}
