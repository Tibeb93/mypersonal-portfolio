import mongoose from 'mongoose'
import slugify from 'slugify'

const blogSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, unique: true },
    excerpt:     { type: String, required: true },
    content:     { type: String, required: true },
    coverImage:  { type: String },
    coverPublicId:{ type: String },
    author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category:    { type: String, required: true },
    tags:        [{ type: String, lowercase: true }],
    status:      { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    featured:    { type: Boolean, default: false },
    views:       { type: Number, default: 0 },
    readTime:    { type: Number, default: 5 }, // minutes
    publishedAt: { type: Date },
    // SEO
    seoTitle:       { type: String },
    seoDescription: { type: String },
    seoKeywords:    [{ type: String }],
  },
  { timestamps: true }
)

// Auto slug + publishedAt
blogSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  // Estimate read time: avg 200 wpm
  if (this.isModified('content')) {
    const words = this.content.trim().split(/\s+/).length
    this.readTime = Math.ceil(words / 200)
  }
  next()
})

blogSchema.index({ status: 1, publishedAt: -1 })
// Note: slug index is already created by unique:true in the schema field
blogSchema.index({ tags: 1 })

export default mongoose.model('Blog', blogSchema)
