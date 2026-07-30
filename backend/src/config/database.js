import mongoose from 'mongoose'
import { setServers, setDefaultResultOrder } from 'dns'
import logger from '../utils/logger.js'

// ── DNS Fix ───────────────────────────────────────────────────────────────────
// Node.js defaults to 127.0.0.1 which has no DNS server running.
// Use the WiFi DNS server which is confirmed to work.
// In production (Render) this is not needed — Render has full DNS.
if (process.env.NODE_ENV !== 'production') {
  setServers(['10.21.71.244']) // WiFi DNS — only one that works for SRV queries
  setDefaultResultOrder('ipv4first')
}

const OPTIONS = {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS:         30000,
  socketTimeoutMS:          45000,
  family:                   4,
  maxPoolSize:              10,
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
      if (isProd) {
        logger.error('Exiting for Render restart.')
        process.exit(1)
      }
      logger.warn(`Retry in 10s...`)
      setTimeout(() => attempt(count + 1), 10000)
    }
  }

  attempt()
}

mongoose.connection.on('connected',    () => { isConnected = true;  logger.info(`MongoDB connected: ${mongoose.connection.host}`) })
mongoose.connection.on('disconnected', () => { isConnected = false; logger.warn('MongoDB disconnected') })
mongoose.connection.on('reconnected',  () => { isConnected = true;  logger.info(`MongoDB reconnected: ${mongoose.connection.host}`) })
mongoose.connection.on('error',        (e) => logger.error(`MongoDB error: ${e.message}`))

export default connectDB
