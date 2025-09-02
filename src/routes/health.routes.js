import { Router } from 'express';
import { health, liveness, readiness } from '../controllers/health.controller.js';

export const healthRouter = Router();
healthRouter.get('/health', health);
healthRouter.get('/liveness', liveness);
healthRouter.get('/readiness', readiness);
