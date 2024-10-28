// @deno-types="npm:@types/express@4"
import express, { NextFunction, Request, Response } from 'express';
import demoData from './data_blob.json' with { type: "json" };

const app = express();
const port = Number(Deno.env.get('PORT')) || 3000;

const reqLogger = (req: Request, _res: Response, next: NextFunction) => {
  console.info(`${req.method} request to "${req.url}" by ${req.hostname}`);
  next();
};

app.use(reqLogger);

app.get('/cocktails', (_req, res) => {
  res.status(200).json(demoData.cocktails)
})

app.get('/cocktails/:id', (req, res) => {
  const idx = Number(req.params.id)
  for (const cocktail of demoData.cocktails) {
    if (cocktail.id === idx) {
      return res.status(200).json(cocktail)
    }
  }

  res.status(400).json({ msg: "Cocktail not found"})
})

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
