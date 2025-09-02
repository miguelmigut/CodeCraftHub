import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';

async function start() {
  await connectDB();
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`[user-svc] listening on :${env.PORT}`);
  });
}

start().catch((e) => {
  console.error('Fatal start error', e);
  process.exit(1);
});
