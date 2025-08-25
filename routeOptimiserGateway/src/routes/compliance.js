import { Router } from 'express';
import { runCompliance } from '../controllers/complianceController.js';

const router = Router();

router.post('/compliance/check', runCompliance);

export default router;


