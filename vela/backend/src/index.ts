import { createContainer } from './container';
import { createApp } from './app';
import { env } from './infrastructure/config/environment';
import { db } from './infrastructure/database/pool';

const container = createContainer();
const app = createApp(container);

app.listen(env.port, async () => {
  console.log(`===============================================`);
  console.log(`🚀 Vela Backend API running on port ${env.port}`);
  console.log(`   Health: http://localhost:${env.port}/api/health`);
  console.log(`   Environment: ${env.nodeEnv}`);
  await db.testConnection();
  console.log(`===============================================`);
});

export { app, container };
