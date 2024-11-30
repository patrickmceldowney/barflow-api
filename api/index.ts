import { Router } from 'https://deno.land/x/oak@v17.1.3/mod.ts';
import cocktailRouter from './routes/cocktail.ts';

const router = new Router({ prefix: '/api' });

router.use(
  '/cocktails',
  cocktailRouter.routes(),
  cocktailRouter.allowedMethods()
);

export default router;
