export function requireRole(...roles) {
  return (req, res, next) => {
    const have = req.user?.roles || [];
    const ok = roles.some(r => have.includes(r));
    if (!ok) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}
