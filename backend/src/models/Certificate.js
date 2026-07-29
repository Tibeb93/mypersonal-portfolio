import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    organization:  { type: String, required: true },
    issueDate:     { type: Date, required: true },
    expiryDate:    { type: Date },
    noExpiry:      { type: Boolean, default: false },
    credentialId:  { type: String },
    credentialUrl: { type: String },
    image:         { type: String },
    imagePublicId: { type: String },
    skills:        [{ type: String }],
    order:         { type: Number, default: 0 },
    visible:       { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Certificate', certificateSchema)
