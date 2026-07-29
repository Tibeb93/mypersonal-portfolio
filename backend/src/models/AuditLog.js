import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema(
  {
    user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName:   { type: String },
    action:     { type: String, required: true }, // CREATE, UPDATE, DELETE, LOGIN, etc.
    resource:   { type: String, required: true }, // projects, skills, etc.
    resourceId: { type: String },
    details:    { type: mongoose.Schema.Types.Mixed },
    ip:         { type: String },
    userAgent:  { type: String },
    status:     { type: String, enum: ['success', 'failure'], default: 'success' },
  },
  { timestamps: true }
)

auditLogSchema.index({ user: 1, createdAt: -1 })
auditLogSchema.index({ resource: 1, action: 1 })

export default mongoose.model('AuditLog', auditLogSchema)
