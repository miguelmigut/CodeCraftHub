export const health = (req, res) => res.json({ status: 'ok' });
export const liveness = (req, res) => res.json({ alive: true });
export const readiness = (req, res) => res.json({ ready: true });
