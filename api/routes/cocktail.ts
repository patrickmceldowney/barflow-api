// @deno-types="npm:@types/express@4"
import { Router } from 'express';
import demoData from '../../data_blob.json' with { type: "json" };


const cocktailRouter = Router();

cocktailRouter.get('/', (_req, res) => {
  res.status(200).json(demoData.cocktails);
});

cocktailRouter.get('/:id', (req, res) => {
  const idx = Number(req.params.id);
  for (const cocktail of demoData.cocktails) {
    if (cocktail.id === idx) {
      return res.status(200).json(cocktail);
    }
  }

  res.status(400).json({ msg: 'Cocktail not found' });
});

export default cocktailRouter;
