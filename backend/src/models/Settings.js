import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema(
  {
    // Singleton — only one document
    siteTitle:     { type: String, default: 'Gebremeskel | Portfolio' },
    siteTagline:   { type: String },
    logo:          { type: String },
    logoPublicId:  { type: String },
    favicon:       { type: String },
    faviconPublicId:{ type: String },
    // Theme
    primaryColor:  { type: String, default: '#8B5CF6' },
    accentColor:   { type: String, default: '#EC4899' },
    // Footer
    footerText:    { type: String },
    copyright:     { type: String },
    // Contact
    contactEmail:  { type: String },
    contactPhone:  { type: String },
    contactAddress:{ type: String },
    // Social links
    socials: {
      github:    { type: String },
      linkedin:  { type: String },
      twitter:   { type: String },
      telegram:  { type: String },
      instagram: { type: String },
      youtube:   { type: String },
    },
    // SEO
    seoTitle:       { type: String },
    seoDescription: { type: String },
    seoKeywords:    [{ type: String }],
    googleAnalytics:{ type: String },
    // Features toggle
    features: {
      blog:         { type: Boolean, default: true },
      darkMode:     { type: Boolean, default: true },
      contactForm:  { type: Boolean, default: true },
      analytics:    { type: Boolean, default: true },
    },
    // Maintenance
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMsg:  { type: String },
  },
  { timestamps: true }
)

export default mongoose.model('Settings', settingsSchema)
