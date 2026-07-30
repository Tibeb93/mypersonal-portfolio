import mongoose from 'mongoose'
import { setServers, setDefaultResultOrder } from 'dns'
import logger from '../utils/logger.js'

// Force public DNS to bypass ISP blocks on MongoDB SRV records
setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])
setDefaultResultOrder('ipv4first')

const OPTIONS = {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS:         30000,
  socketTimeoutMS:          45000,
  family:                   4,
  maxPoolSize:              10,
}

let isConnected = false

const connectDB = async () => {
  if (isConnected) return

  const attempt = async (count = 1) => {
    try {
      await mongoose.connect(process.env.MONGODB_URI, OPTIONS)
      isConnected = true
      logger.info(`MongoDB connected: ${mongoose.connection.host}`)
    } catch (err) {
      logger.error(`MongoDB attempt ${count} failed: ${err.message}`)
      if (process.env.NODE_ENV === 'production') {
        process.exit(1)
      }
      logger.warn(`Retry in 10s... (attempt ${count})`)
      setTimeout(() => attempt(count + 1), 10000)
    }
  }

  attempt()
}

mongoose.connection.on('connected',      () => { isConnected = true;  logger.info(`MongoDB connected: ${mongoose.connection.host}`) })
mongoose.connection.on('disconnected',   () => { isConnected = false; logger.warn('MongoDB disconnected') })
mongoose.connection.on('reconnected',    () => { isConnected = true;  logger.info(`MongoDB reconnected: ${mongoose.connection.host}`) })
mongoose.connection.on('error',          (e) => logger.error(`MongoDB error: ${e.message}`))

export default connectDB
