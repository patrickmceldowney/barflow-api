// @deno-types="npm:@types/express@4"
import { Router } from 'express';
import cocktailRouter from './routes/cocktail.ts';

const apiRouter = Router();

apiRouter.use('/cocktails', cocktailRouter);

export default apiRouter;
