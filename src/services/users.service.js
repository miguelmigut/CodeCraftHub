import { User } from '../models/User.js';

export async function getMe(userId, tenantId) {
  const u = await User.findOne({ _id: userId, tenantId });
  if (!u) throw new Error('NOT_FOUND');
  return u;
}

export async function updateMe(userId, tenantId, patch) {
  const allowed = ['profile', 'locale', 'timeZone', 'name', 'pictureUrl'];
  const toSet = {};
  if (patch.profile) toSet.profile = { ...patch.profile };
  if (patch.name) toSet['profile.name'] = patch.name;
  if (patch.locale) toSet['profile.locale'] = patch.locale;
  if (patch.timeZone) toSet['profile.timeZone'] = patch.timeZone;
  if (patch.pictureUrl) toSet['profile.pictureUrl'] = patch.pictureUrl;

  const u = await User.findOneAndUpdate({ _id: userId, tenantId }, { $set: toSet }, { new: true });
  if (!u) throw new Error('NOT_FOUND');
  return u;
}

// Admin (del tenant)
export async function listUsers(tenantId, { page = 1, limit = 20 }) {
  const q = { tenantId };
  const [items, total] = await Promise.all([
    User.find(q).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    User.countDocuments(q),
  ]);
  return { items, total, page, limit };
}
