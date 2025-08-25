import { Router } from 'express';
import { findRoutes } from '../controllers/routesController.js';

const router = Router();

router.post('/find-routes', findRoutes);

export default router;


