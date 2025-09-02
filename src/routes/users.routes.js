import { Router } from 'express';
import { getMyProfile, patchMyProfile, adminListUsers, validateList } from '../controllers/users.controller.js';
import { requireAuth } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/roles.js';

export const usersRouter = Router();
usersRouter.get('/me', requireAuth, getMyProfile);
usersRouter.patch('/me', requireAuth, patchMyProfile);
usersRouter.get('/', requireAuth, requireRole('admin'), validateList, adminListUsers);
