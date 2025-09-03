import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { env } from '../config/env.js';

const SALT_ROUNDS = 12;

function signAccess(payload) {
  return jwt.sign(payload, env.JWT_PRIVATE_KEY, { algorithm: 'RS256', expiresIn: env.JWT_ACCESS_TTL });
}
function signRefresh(payload) {
  return jwt.sign(payload, env.JWT_PRIVATE_KEY, { algorithm: 'RS256', expiresIn: env.JWT_REFRESH_TTL });
}

export async function register({ tenantId, email, password, profile }) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const doc = await User.create({
    tenantId,
    email: email.toLowerCase(),
    passwordHash,
    roles: ['student'],
    ...(profile?.name ? { profile: { name: profile.name } } : {}),
  });

  return {
    id: doc._id.toString(),
    email: doc.email,
    profile: doc.profile ?? {}
  };
}

export async function login({ tenantId, email, password }) {
  const user = await User.findOne({ tenantId, email: email.toLowerCase() }).select('+passwordHash');
  if (!user) throw new Error('INVALID_CREDENTIALS');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error('INVALID_CREDENTIALS');

  const sid = crypto.randomUUID();
  const accessToken = jwt.sign(
    { sub: user.id, tenantId, roles: user.roles, sid },
    env.JWT_PRIVATE_KEY,
    { algorithm: 'RS256', expiresIn: env.JWT_ACCESS_TTL }
  );
  const refreshToken = jwt.sign(
    { sub: user.id, tenantId, sid },
    env.JWT_PRIVATE_KEY,
    { algorithm: 'RS256', expiresIn: env.JWT_REFRESH_TTL }
  );

  const refreshHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  user.refreshSessions.push({ sid, refreshHash });
  await user.save();

  return { accessToken, refreshToken };
}

export async function rotateRefresh({ token }) {
  const payload = jwt.verify(token, env.JWT_PUBLIC_KEY, { algorithms: ['RS256'] });
  const user = await User.findById(payload.sub).select('+refreshSessions');
  if (!user) throw new Error('INVALID_REFRESH');

  const session = user.refreshSessions.find(s => s.sid === payload.sid && !s.revokedAt);
  if (!session) throw new Error('INVALID_REFRESH');
  const match = await bcrypt.compare(token, session.refreshHash);
  if (!match) {
    // Reuso: invalida todas las sesiones
    user.refreshSessions = user.refreshSessions.map(s => ({ ...s, revokedAt: s.revokedAt ?? new Date() }));
    await user.save();
    throw new Error('REUSED_REFRESH');
  }
  // Rotación: revoca actual y crea nueva
  session.revokedAt = new Date();
  const sid = crypto.randomUUID();
  const accessToken = signAccess({ sub: user.id, tenantId: payload.tenantId, roles: user.roles, sid });
  const refreshToken = signRefresh({ sub: user.id, tenantId: payload.tenantId, sid });
  const refreshHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  user.refreshSessions.push({ sid, refreshHash });
  await user.save();
  return { accessToken, refreshToken };
}

export async function logout({ userId, sid }) {
  const user = await User.findById(userId).select('+refreshSessions');
  if (!user) return;
  user.refreshSessions = user.refreshSessions.map(s => s.sid === sid ? { ...s, revokedAt: new Date() } : s);
  await user.save();
}
