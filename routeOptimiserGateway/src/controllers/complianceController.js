import { validateComplianceRequest } from '../utils/schema.js';
import { checkCompliance } from '../services/geminiClient.js';

export async function runCompliance(req, res, next) {
  try {
    const errors = validateComplianceRequest(req.body || {});
    if (errors.length) {
      return res.status(400).json({ status: 'error', message: 'Invalid request', errors });
    }
    const result = await checkCompliance(req.body);
    return res.json({ status: 'success', ...result });
  } catch (err) {
    next(err);
  }
}


