import mongoose from 'mongoose'
import { setServers, setDefaultResultOrder } from 'dns'
import logger from '../utils/logger.js'

// Force Node.js to use public DNS servers that support SRV record lookups.
// Some ISP/corporate DNS resolvers block SRV queries which breaks mongodb+srv:// URIs.
setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])
setDefaultResultOrder('ipv4first')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    })
    logger.info(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`)
    process.exit(1)
  }
}

// Handle connection events
mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'))
mongoose.connection.on('reconnected', () => logger.info('MongoDB reconnected'))

export default connectDB
