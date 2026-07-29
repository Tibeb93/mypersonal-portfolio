import mongoose from 'mongoose'

const mediaSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    url:         { type: String, required: true },
    publicId:    { type: String, required: true },
    resourceType:{ type: String, enum: ['image', 'video', 'raw'], default: 'image' },
    format:      { type: String },
    size:        { type: Number }, // bytes
    width:       { type: Number },
    height:      { type: Number },
    folder:      { type: String, default: 'portfolio' },
    alt:         { type: String },
    caption:     { type: String },
    tags:        [{ type: String }],
    uploadedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

mediaSchema.index({ folder: 1, createdAt: -1 })
mediaSchema.index({ resourceType: 1 })

export default mongoose.model('Media', mediaSchema)
