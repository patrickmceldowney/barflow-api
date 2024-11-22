// @deno-types="npm:@types/express@4"
import express, { NextFunction, Request, Response } from 'express';
import apiRouter from './api/index.ts';

const app = express();
const port = Number(Deno.env.get('PORT')) || 3000;

const reqLogger = (req: Request, _res: Response, next: NextFunction) => {
  console.info(`${req.method} request to "${req.url}" by ${req.hostname}`);
  next();
};

app.get('/', (_req, res) => {
  res.send('<p>Wecome to the Barflow API</p>');
});

app.use(express.json());
app.use(reqLogger);
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
