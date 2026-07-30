import mongoose from 'mongoose'
import { setServers, setDefaultResultOrder } from 'dns'
import logger from '../utils/logger.js'

// Force public DNS — fixes ISP blocking MongoDB SRV records
setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])
setDefaultResultOrder('ipv4first')

const MONGO_URI = () => process.env.MONGODB_URI

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
      const conn = await mongoose.connect(MONGO_URI(), MONGO_OPTIONS)
      logger.info(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
      logger.error(`MongoDB connection attempt ${attempt} failed: ${error.message}`)

      if (process.env.NODE_ENV === 'production') {
        logger.error('Production MongoDB failed. Exiting for Render restart.')
        process.exit(1)
      }

      // Development — retry every 10s without crashing
      logger.warn(`Retrying in 10 seconds... (attempt ${attempt})`)
      setTimeout(tryConnect, 10000)
    }
  }

  await tryConnect()
}

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected')
  if (process.env.NODE_ENV !== 'production') {
    setTimeout(async () => {
      try {
        const conn = await mongoose.connect(MONGO_URI(), MONGO_OPTIONS)
        logger.info(`MongoDB reconnected: ${conn.connection.host}`)
      } catch (e) {
        logger.error(`MongoDB reconnect failed: ${e.message}`)
      }
    }, 5000)
  }
})

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB error: ${err.message}`)
})

export default connectDB
