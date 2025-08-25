export function errorHandler(err, req, res, next) {
  const status = err.status || (err.response && err.response.status) || 500;
  const message = err.message || 'Internal Server Error';
  // Optionally include details in non-production
  const payload = { status: 'error', message };
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.stack = err.stack;
  }
  res.status(status).json(payload);
}


