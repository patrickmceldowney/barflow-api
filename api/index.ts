import { Router } from 'https://deno.land/x/oak@v17.1.3/mod.ts';
import cocktailRouter from './routes/cocktail.ts';

const router = new Router();

router.get('/', (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = '<h1>Wecome to the Barflow API</h1>';
});

router.use(
  '/cocktails',
  cocktailRouter.routes(),
  cocktailRouter.allowedMethods()
);

export default router;
