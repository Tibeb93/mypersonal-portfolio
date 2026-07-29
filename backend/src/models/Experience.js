import mongoose from 'mongoose'

const experienceSchema = new mongoose.Schema(
  {
    company:         { type: String, required: true, trim: true },
    position:        { type: String, required: true, trim: true },
    location:        { type: String },
    startDate:       { type: Date, required: true },
    endDate:         { type: Date },
    current:         { type: Boolean, default: false },
    description:     { type: String },
    responsibilities:[{ type: String }],
    achievements:    [{ type: String }],
    technologies:    [{ type: String }],
    companyLogo:     { type: String },
    companyLogoPublicId: { type: String },
    companyUrl:      { type: String },
    type:            { type: String, enum: ['full-time', 'part-time', 'freelance', 'internship', 'contract'], default: 'full-time' },
    order:           { type: Number, default: 0 },
    visible:         { type: Boolean, default: true },
  },
  { timestamps: true }
)

experienceSchema.index({ order: 1, startDate: -1 })

export default mongoose.model('Experience', experienceSchema)
