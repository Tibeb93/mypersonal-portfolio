/**
 * Standardised API response helpers
 */

export const sendSuccess = (res, data = {}, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  })
}

export const sendError = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  const payload = { success: false, message, timestamp: new Date().toISOString() }
  if (errors) payload.errors = errors
  res.status(statusCode).json(payload)
}

export const sendPaginated = (res, data, total, page, limit, message = 'Success') => {
  res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    timestamp: new Date().toISOString(),
  })
}
