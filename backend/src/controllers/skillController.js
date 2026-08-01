import Skill from '../models/Skill.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'
import { cacheGet, cacheSet, cacheInvalidate } from '../utils/cache.js'

// GET /api/skills  (public)
export const getSkills = async (req, res) => {
  try {
    const category = req.query.category || 'all'
    const cacheKey = `skills:${category}`
    const cached = cacheGet(cacheKey)
    if (cached) return res.json(cached)

    const filter = { visible: true }
    if (req.query.category) filter.category = req.query.category

    const skills = await Skill.find(filter).sort({ category: 1, order: 1, level: -1 })

    // Group by category
    const grouped = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = []
      acc[skill.category].push(skill)
      return acc
    }, {})

    const response = { success: true, data: { skills, grouped }, timestamp: new Date().toISOString() }
    cacheSet(cacheKey, response, 120 * 1000)
    sendSuccess(res, { skills, grouped })
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/admin/skills  (admin — includes hidden)
export const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1 })
    sendSuccess(res, { skills })
  } catch (err) {
    sendError(res, err.message)
  }
}

// POST /api/admin/skills  (admin)
export const createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body)
    cacheInvalidate('skills')
    if (global.io) global.io.emit('data:changed', { resource: 'skills' })
    sendSuccess(res, { skill }, 'Skill created', 201)
  } catch (err) {
    sendError(res, err.message)
  }
}

// PUT /api/admin/skills/:id  (admin)
export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!skill) return sendError(res, 'Skill not found.', 404)
    cacheInvalidate('skills')
    if (global.io) global.io.emit('data:changed', { resource: 'skills' })
    sendSuccess(res, { skill }, 'Skill updated')
  } catch (err) {
    sendError(res, err.message)
  }
}

// DELETE /api/admin/skills/:id  (admin)
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id)
    if (!skill) return sendError(res, 'Skill not found.', 404)
    cacheInvalidate('skills')
    if (global.io) global.io.emit('data:changed', { resource: 'skills' })
    sendSuccess(res, {}, 'Skill deleted')
  } catch (err) {
    sendError(res, err.message)
  }
}

// PUT /api/admin/skills/reorder  (admin)
export const reorderSkills = async (req, res) => {
  try {
    const { order } = req.body // [{ id, order }]
    await Promise.all(
      order.map(({ id, order: o }) => Skill.findByIdAndUpdate(id, { order: o }))
    )
    cacheInvalidate('skills')
    if (global.io) global.io.emit('data:changed', { resource: 'skills' })
    sendSuccess(res, {}, 'Skills reordered')
  } catch (err) {
    sendError(res, err.message)
  }
}
