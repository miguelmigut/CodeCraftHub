import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, env.JWT_PUBLIC_KEY, { algorithms: ['RS256'] });
    req.user = payload; // { sub, tenantId, roles, sid, iat, exp }
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
