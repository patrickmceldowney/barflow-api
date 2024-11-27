import router from './api/index.ts';
import { Router } from 'https://deno.land/x/oak@v17.1.3/mod.ts';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';
import { Application } from 'https://deno.land/x/oak@v17.1.3/mod.ts';
import { Database } from './tools/db.ts';
import { AppState } from './types/index.ts';

const port = Number(Deno.env.get('PORT')) || 3000;
const app = new Application<AppState>();
const db = new Database();

try {
  await db.connect();
  console.log(`Connected to the database...`);

  // Inject the db instance into the routes
  app.use(async (ctx, next) => {
    ctx.state.db = db;
    await next();
  });

  app.use(oakCors());

  // Logger middleware
  app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get('X-Response-Time');
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
  });

  // Timing middleware
  app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set('X-Response-Time', `${ms}ms`);
  });

  // Error handler
  app.addEventListener('error', (evt) => {
    console.log(evt.error);
  });

  // Routes
  const apiRouter = new Router({ prefix: '/api' });
  apiRouter.use(router.routes());
  apiRouter.use(router.allowedMethods());

  app.use(apiRouter.routes());
  app.use(apiRouter.allowedMethods());

  await app.listen({ port });
} catch (error) {
  console.error(`Error starting application: `, error);
} finally {
  await db.disconnect();
}

Deno.addSignalListener('SIGINT', async () => {
  console.log('Gracefully shutting down...');
  await db.disconnect();
  Deno.exit();
});
