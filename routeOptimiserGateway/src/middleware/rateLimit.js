const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000); // 1 min
const maxRequests = Number(process.env.RATE_LIMIT_MAX || 60); // 60 req/min

const ipBuckets = new Map();

export function rateLimit(req, res, next) {
  const now = Date.now();
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const record = ipBuckets.get(ip) || { count: 0, resetAt: now + windowMs };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }

  record.count += 1;
  ipBuckets.set(ip, record);

  if (record.count > maxRequests) {
    res.set('Retry-After', Math.ceil((record.resetAt - now) / 1000));
    return res.status(429).json({ status: 'error', message: 'Too many requests' });
  }

  next();
}


