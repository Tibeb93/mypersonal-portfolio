import mongoose from 'mongoose'

const contactMessageSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true, trim: true },
    email:      { type: String, required: true, lowercase: true, trim: true },
    subject:    { type: String, required: true, trim: true },
    message:    { type: String, required: true },
    phone:      { type: String },
    status:     { type: String, enum: ['unread', 'read', 'replied', 'archived'], default: 'unread' },
    ipAddress:  { type: String },
    userAgent:  { type: String },
    repliedAt:  { type: Date },
    notes:      { type: String }, // admin internal notes
  },
  { timestamps: true }
)

contactMessageSchema.index({ status: 1, createdAt: -1 })

export default mongoose.model('ContactMessage', contactMessageSchema)
