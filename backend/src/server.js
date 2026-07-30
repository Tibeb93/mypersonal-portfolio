import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import mongoose from 'mongoose'

import connectDB from './config/database.js'
import logger from './utils/logger.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

// ── Route imports ────────────────────────────────────────────────────────────
import authRoutes         from './routes/authRoutes.js'
import profileRoutes      from './routes/profileRoutes.js'
import skillRoutes        from './routes/skillRoutes.js'
import projectRoutes      from './routes/projectRoutes.js'
import experienceRoutes   from './routes/experienceRoutes.js'
import educationRoutes    from './routes/educationRoutes.js'
import certificateRoutes  from './routes/certificateRoutes.js'
import blogRoutes         from './routes/blogRoutes.js'
import contactRoutes      from './routes/contactRoutes.js'
import mediaRoutes        from './routes/mediaRoutes.js'
import settingsRoutes     from './routes/settingsRoutes.js'
import analyticsRoutes    from './routes/analyticsRoutes.js'
import auditLogRoutes     from './routes/auditLogRoutes.js'

// ── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB()

const app  = express()
const PORT = process.env.PORT || 5000

// ── Security middleware ──────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow Cloudinary images
}))

// CORS — allow frontend + admin origins
// Support comma-separated list of origins in ADMIN_URL
const parseOrigins = (val) =>
  (val || '').split(',').map(s => s.trim()).filter(Boolean)

const allowedOrigins = [
  ...(process.env.FRONTEND_URL ? parseOrigins(process.env.FRONTEND_URL) : ['http://localhost:5173']),
  ...(process.env.ADMIN_URL    ? parseOrigins(process.env.ADMIN_URL)    : ['http://localhost:5174']),
  // Always allow Vercel preview deployments for this project
  'https://mypersonal-portfolio-lxjb.vercel.app',
  'https://mypersonal-portfolio-1smv.vercel.app',
  'https://mypersonal-portfolio-gm.vercel.app',
]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile, server-to-server)
    if (!origin) return callback(null, true)
    // Allow any Vercel preview URL for this project
    if (origin.endsWith('.vercel.app')) return callback(null, true)
    // Allow explicitly whitelisted origins
    if (allowedOrigins.includes(origin)) return callback(null, true)
    // Block everything else
    callback(new Error(`CORS: Origin ${origin} not allowed`))
  },
  credentials: true, // Required for httpOnly cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Global rate limit — 100 requests per 15 minutes per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path.startsWith('/api/admin'), // Admin has its own limits
}))

// ── General middleware ───────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())
app.use(mongoSanitize())                               // Prevent NoSQL injection
app.use(morgan('dev', {
  stream: { write: (msg) => logger.http(msg.trim()) }
}))

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'Portfolio CMS API',
    version: '1.0.0',
    status: 'running',
    docs: '/health — server health | /api/* — all endpoints',
  })
})

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio API is running',
    env:     process.env.NODE_ENV,
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

// ── API Routes ───────────────────────────────────────────────────────────────
//  Public routes
app.use('/api/auth',         authRoutes)
app.use('/api/profile',      profileRoutes)
app.use('/api/skills',       skillRoutes)
app.use('/api/projects',     projectRoutes)
app.use('/api/experience',   experienceRoutes)
app.use('/api/education',    educationRoutes)
app.use('/api/certificates', certificateRoutes)
app.use('/api/blog',         blogRoutes)
app.use('/api/contact',      contactRoutes)
app.use('/api/settings',     settingsRoutes)

//  Admin-only routes
app.use('/api/admin/skills',       skillRoutes)
app.use('/api/admin/projects',     projectRoutes)
app.use('/api/admin/experience',   experienceRoutes)
app.use('/api/admin/education',    educationRoutes)
app.use('/api/admin/certificates', certificateRoutes)
app.use('/api/admin/blog',         blogRoutes)
app.use('/api/admin/contact',      contactRoutes)
app.use('/api/admin/profile',      profileRoutes)
app.use('/api/admin/media',        mediaRoutes)
app.use('/api/admin/settings',     settingsRoutes)
app.use('/api/admin/analytics',    analyticsRoutes)
app.use('/api/admin/audit-log',    auditLogRoutes)

// ── 404 + Error handlers ─────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  logger.info(`📡 Health check: http://localhost:${PORT}/health`)
})

// ── Graceful shutdown ─────────────────────────────────────────────────────────
process.on('SIGINT', async () => {
  await mongoose.connection.close().catch(() => {})
  logger.info('Server shutting down gracefully')
  process.exit(0)
})

export default app
