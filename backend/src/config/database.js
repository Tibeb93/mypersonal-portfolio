import mongoose from 'mongoose'
import { setServers, setDefaultResultOrder } from 'dns'
import logger from '../utils/logger.js'

// Force Node.js to use public DNS — fixes ISP DNS blocking MongoDB SRV records
setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])
setDefaultResultOrder('ipv4first')

const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS:         30000,
  socketTimeoutMS:          45000,
  family:                   4,
}

const connectDB = async () => {
  let attempt = 0

  const tryConnect = async () => {
    attempt++
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, MONGO_OPTIONS)
      logger.info(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
      logger.error(`MongoDB connection attempt ${attempt} failed: ${error.message}`)

      // In production — exit so Render restarts the service
      if (process.env.NODE_ENV === 'production') {
        logger.error('Production MongoDB failed. Exiting for restart.')
        process.exit(1)
      }

      // In development — keep retrying every 10s without crashing the server
      logger.warn(`Retrying MongoDB connection in 10 seconds... (attempt ${attempt})`)
      setTimeout(tryConnect, 10000)
    }
  }

  await tryConnect()
}

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected')
  // Auto-reconnect in development
  if (process.env.NODE_ENV !== 'production') {
    logger.warn('Attempting to reconnect...')
    setTimeout(() => mongoose.connect(process.env.MONGODB_URI, MONGO_OPTIONS).catch(() => {}), 5000)
  }
})

mongoose.connection.on('reconnected', () => logger.info('MongoDB reconnected'))
mongoose.connection.on('error',       (err) => logger.error(`MongoDB error: ${err.message}`))

export default connectDB
