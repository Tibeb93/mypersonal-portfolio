import logger from '../utils/logger.js'

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message    = err.message    || 'Internal Server Error'

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`
    statusCode = 409
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(e => e.message).join(', ')
    statusCode = 422
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = `Invalid ${err.path}: ${err.value}`
    statusCode = 400
  }

  if (statusCode >= 500) logger.error(`${req.method} ${req.path} - ${err.stack}`)
  else logger.warn(`${req.method} ${req.path} - ${message}`)

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString(),
  })
}

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
}
