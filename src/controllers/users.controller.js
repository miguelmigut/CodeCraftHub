import { asyncHandler } from '../utils/asyncHandler.js';
import { getMe, updateMe, listUsers } from '../services/users.service.js';
import { celebrate, Joi, Segments } from 'celebrate';

export const getMyProfile = asyncHandler(async (req, res) => {
  const me = await getMe(req.user.sub, req.user.tenantId);
  res.json(me);
});

export const patchMyProfile = asyncHandler(async (req, res) => {
  const updated = await updateMe(req.user.sub, req.user.tenantId, req.body || {});
  res.json(updated);
});

export const validateList = celebrate({
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  })
});

export const adminListUsers = asyncHandler(async (req, res) => {
  const data = await listUsers(req.user.tenantId, {
    page: Number(req.query.page || 1),
    limit: Number(req.query.limit || 20),
  });
  res.json(data);
});
