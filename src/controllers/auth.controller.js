import { asyncHandler } from '../utils/asyncHandler.js';
import { login, register, rotateRefresh, logout } from '../services/auth.service.js';
import { celebrate, Joi, Segments } from 'celebrate';

export const validateRegister = celebrate({
  [Segments.BODY]: Joi.object({
    tenantId: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

export const validateLogin = celebrate({
  [Segments.BODY]: Joi.object({
    tenantId: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export const validateRefresh = celebrate({
  [Segments.BODY]: Joi.object({ refreshToken: Joi.string().required() }),
});

export const postRegister = asyncHandler(async (req, res) => {
  const user = await register(req.body);
  res.status(201).json(user);
});

export const postLogin = asyncHandler(async (req, res) => {
  const tokens = await login(req.body);
  res.json(tokens);
});

export const postRefresh = asyncHandler(async (req, res) => {
  const tokens = await rotateRefresh({ token: req.body.refreshToken });
  res.json(tokens);
});

export const postLogout = asyncHandler(async (req, res) => {
  await logout({ userId: req.user.sub, sid: req.user.sid });
  res.status(204).send();
});
