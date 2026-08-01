import mongoose from 'mongoose'
import { setDefaultResultOrder } from 'dns'
import logger from '../utils/logger.js'

// ── DNS Fix ───────────────────────────────────────────────────────────────────
// Use IPv4 first for better compatibility with MongoDB Atlas SRV connections.
// No hardcoded DNS servers — uses system defaults which work everywhere.
setDefaultResultOrder('ipv4first')

const OPTIONS = {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS:         10000,
  socketTimeoutMS:          30000,
  family:                   4,
  maxPoolSize:              15,
  minPoolSize:              2,
  maxIdleTimeMS:            30000,
  retryWrites:              true,
  retryReads:               true,
}

let isConnected = false

const connectDB = async () => {
  const isProd = process.env.NODE_ENV === 'production'

  const attempt = async (count = 1) => {
    try {
      await mongoose.connect(process.env.MONGODB_URI, OPTIONS)
      isConnected = true
      logger.info(`MongoDB connected: ${mongoose.connection.host}`)
    } catch (err) {
      logger.error(`MongoDB attempt ${count} failed: ${err.message}`)
      if (isProd && count >= 5) {
        logger.error('Exiting for Render restart after 5 attempts.')
        process.exit(1)
      }
      const delay = Math.min(5000 * count, 30000)
      logger.warn(`Retry in ${delay / 1000}s...`)
      setTimeout(() => attempt(count + 1), delay)
    }
  }

  attempt()
}

mongoose.connection.on('connected',    () => { isConnected = true;  logger.info(`MongoDB connected: ${mongoose.connection.host}`) })
mongoose.connection.on('disconnected', () => { isConnected = false; logger.warn('MongoDB disconnected') })
mongoose.connection.on('reconnected',  () => { isConnected = true;  logger.info(`MongoDB reconnected: ${mongoose.connection.host}`) })
mongoose.connection.on('error',        (e) => logger.error(`MongoDB error: ${e.message}`))

export default connectDB
