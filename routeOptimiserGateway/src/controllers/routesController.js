import { makeHttpClient } from '../utils/httpClient.js';
import { config } from '../config/index.js';

const http = makeHttpClient(config.pythonBaseUrl, config.pythonTimeoutMs);

function validatePayload(body) {
  const required = ['startLat', 'startLon', 'endLat', 'endLon', 'optimizationType', 'weight', 'volume', 'initialCountry', 'finalCountry'];
  for (const key of required) {
    if (body[key] === undefined || body[key] === null || body[key] === '') {
      throw Object.assign(new Error(`Missing or invalid field: ${key}`), { status: 400 });
    }
  }
  const nums = ['startLat', 'startLon', 'endLat', 'endLon', 'weight', 'volume'];
  for (const k of nums) {
    if (Number.isNaN(Number(body[k]))) {
      throw Object.assign(new Error(`Field must be a number: ${k}`), { status: 400 });
    }
  }
  const allowed = ['time', 'cost', 'emissions', 'logisticsScore', 'customWeights'];
  if (!allowed.includes(body.optimizationType)) {
    throw Object.assign(new Error('Invalid optimizationType'), { status: 400 });
  }
}

export async function findRoutes(req, res, next) {
  try {
    validatePayload(req.body);
    const response = await http.post('/api/find-routes', req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    next(err);
  }
}


