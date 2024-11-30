import router from './api/index.ts';
import { Router } from 'https://deno.land/x/oak@v17.1.3/mod.ts';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';
import { Application } from 'https://deno.land/x/oak@v17.1.3/mod.ts';
import { DatabaseClient } from './tools/db.ts';
import { AppState } from './types/index.ts';

const port = Number(Deno.env.get('PORT')) || 3000;
const app = new Application<AppState>();
const db = new DatabaseClient();

try {
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
  const apiRouter = new Router();
  apiRouter.use(router.routes());
  apiRouter.use(router.allowedMethods());

  apiRouter.get('/', (ctx) => {
    ctx.response.status = 200;
    ctx.response.body = '<h1>Wecome to the Barflow API</h1>';
    ctx.response.type = 'html';
  });

  app.use(apiRouter.routes());
  app.use(apiRouter.allowedMethods());

  console.log(`Listening on port ${port}...`);
  await app.listen({ port });
} catch (error) {
  console.error(`Error starting application: `, error);
}

Deno.addSignalListener('SIGINT', () => {
  console.log('Gracefully shutting down...');
  Deno.exit();
});
