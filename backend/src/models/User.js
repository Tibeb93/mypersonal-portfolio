import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role:     { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
    avatar:   { type: String, default: null },
    isActive: { type: Boolean, default: true },
    lastLogin:{ type: Date, default: null },
    refreshToken: { type: String, select: false, default: null },
    passwordResetToken:   { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
  },
  { timestamps: true }
)

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.refreshToken
  delete obj.passwordResetToken
  delete obj.passwordResetExpires
  return obj
}

export default mongoose.model('User', userSchema)
