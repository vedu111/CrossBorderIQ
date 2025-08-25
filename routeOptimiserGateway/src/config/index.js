export const config = {
  port: process.env.PORT || '3000',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  pythonBaseUrl: process.env.PYTHON_BASE_URL || 'http://localhost:5001',
  pythonTimeoutMs: Number(process.env.PYTHON_TIMEOUT_MS || 120000),
};


