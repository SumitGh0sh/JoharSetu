/**
 * Centralized Error & 404 Handlers
 */

const notFound = (req, res, next) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack || err.message);

  const statusCode = res.statusCode === 200 ? (err.status || 500) : res.statusCode;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
