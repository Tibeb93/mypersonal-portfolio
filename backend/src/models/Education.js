import mongoose from 'mongoose'

const educationSchema = new mongoose.Schema(
  {
    university:     { type: String, required: true, trim: true },
    degree:         { type: String, required: true },
    field:          { type: String, required: true },
    startDate:      { type: Date, required: true },
    endDate:        { type: Date },
    current:        { type: Boolean, default: false },
    gpa:            { type: String },
    description:    { type: String },
    activities:     [{ type: String }],
    achievements:   [{ type: String }],
    logo:           { type: String },
    logoPublicId:   { type: String },
    location:       { type: String },
    order:          { type: Number, default: 0 },
    visible:        { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Education', educationSchema)
