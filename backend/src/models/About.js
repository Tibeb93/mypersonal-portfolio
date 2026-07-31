import mongoose from 'mongoose'

const aboutSchema = new mongoose.Schema(
  {
    title:       { type: String, default: 'About Me' },
    subtitle:    { type: String, default: 'Get to know me better' },
    heading:     { type: String, default: 'Passionate Developer, Creative Thinker' },
    description: { type: String, default: '' },
    image:       { type: String, default: '' },
    mission:     { type: String, default: '' },
    vision:      { type: String, default: '' },
    values: [
      {
        title:       { type: String },
        description: { type: String },
        icon:        { type: String },
      },
    ],
    stats: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    ctaText:  { type: String, default: 'Get In Touch' },
    ctaLink:  { type: String, default: '#contact' },
  },
  { timestamps: true }
)

export default mongoose.model('About', aboutSchema)
