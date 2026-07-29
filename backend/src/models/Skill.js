import mongoose from 'mongoose'

const skillSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    icon:        { type: String },
    iconColor:   { type: String },
    level:       { type: Number, min: 0, max: 100, required: true },
    category:    {
      type: String,
      enum: ['frontend', 'backend', 'database', 'tools', 'devops', 'design', 'other'],
      required: true,
    },
    description: { type: String },
    order:       { type: Number, default: 0 },
    visible:     { type: Boolean, default: true },
  },
  { timestamps: true }
)

skillSchema.index({ category: 1, order: 1 })

export default mongoose.model('Skill', skillSchema)
