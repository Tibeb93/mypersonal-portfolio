import mongoose from 'mongoose'

const socialSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    url:      { type: String, required: true },
    icon:     { type: String },
  },
  { _id: false }
)

const profileSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true },
    title:          { type: String, required: true },
    subtitle:       { type: String },
    bio:            { type: String, required: true },
    shortBio:       { type: String },
    location:       { type: String },
    email:          { type: String, required: true },
    phone:          { type: String },
    website:        { type: String },
    profileImage:   { type: String },
    heroImage:      { type: String },
    resumeUrl:      { type: String },
    yearsExperience:{ type: Number, default: 0 },
    projectsCount:  { type: Number, default: 0 },
    available:      { type: Boolean, default: true },
    availabilityNote:{ type: String, default: 'Available for opportunities' },
    socials:        [socialSchema],
    goals:          { type: String },
    careerJourney:  { type: String },
  },
  { timestamps: true }
)

export default mongoose.model('Profile', profileSchema)
