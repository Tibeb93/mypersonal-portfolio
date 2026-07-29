import mongoose from 'mongoose'

const pageViewSchema = new mongoose.Schema(
  {
    page:       { type: String, required: true },
    ip:         { type: String },
    userAgent:  { type: String },
    referrer:   { type: String },
    country:    { type: String },
    sessionId:  { type: String },
  },
  { timestamps: true }
)

pageViewSchema.index({ page: 1, createdAt: -1 })
pageViewSchema.index({ createdAt: -1 })

export default mongoose.model('PageView', pageViewSchema)
