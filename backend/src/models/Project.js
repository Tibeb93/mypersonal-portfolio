import mongoose from 'mongoose'
import slugify from 'slugify'

const screenshotSchema = new mongoose.Schema(
  {
    url:     { type: String, required: true },
    publicId:{ type: String },
    caption: { type: String },
  },
  { _id: false }
)

const projectSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true, trim: true },
    slug:         { type: String, unique: true },
    description:  { type: String, required: true },
    longDesc:     { type: String },
    thumbnail:    { type: String },
    thumbnailPublicId: { type: String },
    screenshots:  [screenshotSchema],
    demoVideo:    { type: String },
    demoVideoPublicId: { type: String },
    githubUrl:    { type: String },
    liveUrl:      { type: String },
    technologies: [{ type: String }],
    category:     {
      type: String,
      enum: ['web', 'mobile', 'api', 'fullstack', 'frontend', 'backend', 'other'],
      default: 'fullstack',
    },
    featured:     { type: Boolean, default: false },
    status:       { type: String, enum: ['completed', 'in-progress', 'archived'], default: 'completed' },
    order:        { type: Number, default: 0 },
    visible:      { type: Boolean, default: true },
    views:        { type: Number, default: 0 },
    startDate:    { type: Date },
    endDate:      { type: Date },
  },
  { timestamps: true }
)

// Auto-generate slug
projectSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  next()
})

projectSchema.index({ featured: -1, order: 1 })
// Note: slug index is already created by unique:true in the schema field

export default mongoose.model('Project', projectSchema)
