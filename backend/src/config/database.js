import mongoose from 'mongoose'
import { setServers, setDefaultResultOrder } from 'dns'
import logger from '../utils/logger.js'

// Force Node.js to use public DNS servers that support SRV record lookups.
// Some ISP/corporate DNS resolvers block SRV queries which breaks mongodb+srv:// URIs.
setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])
setDefaultResultOrder('ipv4first')

const connectDB = async (retries = 5) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 30000, // increased from 10s to 30s
        connectTimeoutMS:         30000,
        socketTimeoutMS:          30000,
        family: 4,
      })
      logger.info(`MongoDB connected: ${conn.connection.host}`)
      return // success — exit
    } catch (error) {
      logger.error(`MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`)
      if (attempt === retries) {
        logger.error('All MongoDB connection attempts failed. Exiting.')
        process.exit(1)
      }
      // Wait 3 seconds before retrying
      logger.warn(`Retrying in 3 seconds...`)
      await new Promise((r) => setTimeout(r, 3000))
    }
  }
}

// Handle connection events
mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'))
mongoose.connection.on('reconnected',  () => logger.info('MongoDB reconnected'))

export default connectDB
