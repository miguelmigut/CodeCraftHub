import { Router } from 'express';
import { postRegister, postLogin, postRefresh, postLogout, validateRegister, validateLogin, validateRefresh } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.js';

export const authRouter = Router();
authRouter.post('/register', validateRegister, postRegister);
authRouter.post('/login',    validateLogin,    postLogin);
authRouter.post('/refresh',  validateRefresh,  postRefresh);
authRouter.post('/logout',   requireAuth,      postLogout);
