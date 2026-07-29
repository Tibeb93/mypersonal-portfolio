import Blog from '../models/Blog.js'
import { sendSuccess, sendError, sendPaginated } from '../utils/apiResponse.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js'
import { incrementBlogView } from '../middleware/analytics.js'

// GET /api/blog  (public — published only)
export const getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, search, featured } = req.query
    const filter = { status: 'published' }

    if (category)  filter.category = category
    if (tag)       filter.tags = { $in: [tag.toLowerCase()] }
    if (featured === 'true') filter.featured = true
    if (search)    filter.$or = [
      { title:   { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { tags:    { $in: [search.toLowerCase()] } },
    ]

    const total = await Blog.countDocuments(filter)
    const blogs = await Blog.find(filter)
      .select('-content')
      .populate('author', 'name avatar')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    sendPaginated(res, blogs, total, page, limit)
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/blog/:slug  (public)
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' })
      .populate('author', 'name avatar')

    if (!blog) return sendError(res, 'Blog post not found.', 404)

    incrementBlogView(blog._id)

    sendSuccess(res, { blog })
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/admin/blog  (admin — all statuses)
export const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query
    const filter = {}
    if (status) filter.status = status
    if (search) filter.title = { $regex: search, $options: 'i' }

    const total = await Blog.countDocuments(filter)
    const blogs = await Blog.find(filter)
      .select('-content')
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    sendPaginated(res, blogs, total, page, limit)
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/admin/blog/:id  (admin)
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name')
    if (!blog) return sendError(res, 'Blog post not found.', 404)
    sendSuccess(res, { blog })
  } catch (err) {
    sendError(res, err.message)
  }
}

// POST /api/admin/blog  (admin)
export const createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body, author: req.user._id })
    sendSuccess(res, { blog }, 'Blog post created', 201)
  } catch (err) {
    sendError(res, err.message)
  }
}

// PUT /api/admin/blog/:id  (admin)
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!blog) return sendError(res, 'Blog post not found.', 404)
    sendSuccess(res, { blog }, 'Blog post updated')
  } catch (err) {
    sendError(res, err.message)
  }
}

// DELETE /api/admin/blog/:id  (admin)
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) return sendError(res, 'Blog post not found.', 404)
    if (blog.coverPublicId) await deleteFromCloudinary(blog.coverPublicId).catch(() => {})
    await blog.deleteOne()
    sendSuccess(res, {}, 'Blog post deleted')
  } catch (err) {
    sendError(res, err.message)
  }
}

// POST /api/admin/blog/:id/cover  (admin)
export const uploadCoverImage = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 'No file uploaded.', 400)
    const blog = await Blog.findById(req.params.id)
    if (!blog) return sendError(res, 'Blog post not found.', 404)

    if (blog.coverPublicId) await deleteFromCloudinary(blog.coverPublicId).catch(() => {})

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/blog')
    blog.coverImage = result.secure_url
    blog.coverPublicId = result.public_id
    await blog.save()

    sendSuccess(res, { url: result.secure_url, blog }, 'Cover image uploaded')
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/blog/categories  (public)
export const getBlogCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct('category', { status: 'published' })
    sendSuccess(res, { categories })
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/blog/tags  (public)
export const getBlogTags = async (req, res) => {
  try {
    const tags = await Blog.distinct('tags', { status: 'published' })
    sendSuccess(res, { tags })
  } catch (err) {
    sendError(res, err.message)
  }
}
