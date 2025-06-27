import express, { Request, Response } from 'express';
import { apiAuth } from '../../tools/middleware';
import { CocktailCreatePayload } from '../../types/api';

const cocktailRouter = express.Router();

cocktailRouter.use(apiAuth);

cocktailRouter.get('/', async (req: Request, res: Response) => {
  try {
    // TODO: Replace with Prisma client calls
    const db = req.db;
    
    // Mock data for now - replace with actual Prisma queries
    const mockCocktails = [
      {
        id: 1,
        name: 'Margarita',
        description: 'A classic tequila cocktail',
        glass: 'margarita',
        category: 'sour'
      }
    ];

    res.status(200).json(mockCocktails);
  } catch (error) {
    console.error('Error getting cocktails', error);
    res.status(500).json({
      message: 'Error getting cocktails',
    });
  }
});

cocktailRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // TODO: Replace with Prisma client calls
    const db = req.db;

    // Mock data for now - replace with actual Prisma query
    const mockCocktail = {
      id: parseInt(id),
      name: 'Margarita',
      description: 'A classic tequila cocktail',
      glass: 'margarita',
      category: 'sour'
    };

    if (!mockCocktail) {
      return res.status(404).json({ message: 'Cocktail not found' });
    }

    res.json(mockCocktail);
  } catch (error) {
    console.error('Error getting cocktail', error);
    res.status(500).json({
      message: 'Error getting cocktail',
    });
  }
});

cocktailRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // TODO: Replace with Prisma client calls
    const db = req.db;

    // Mock deletion - replace with actual Prisma delete
    const deleted = true; // Mock result

    if (!deleted) {
      return res.status(404).json({
        message: 'Cocktail not found',
      });
    }

    res.json({
      message: 'Cocktail deleted successfully',
    });
  } catch (error) {
    console.error('API Error', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

cocktailRouter.post('/', async (req: Request, res: Response) => {
  try {
    const cocktailData: CocktailCreatePayload = req.body;

    if (
      !cocktailData.name ||
      !cocktailData.slug ||
      !cocktailData.glass ||
      !cocktailData.category ||
      !cocktailData.ingredients ||
      !cocktailData.recipeSteps
    ) {
      return res.status(400).json({ error: 'Missing required cocktail fields.' });
    }

    // TODO: Replace with Prisma client calls
    const db = req.db;
    
    // Mock creation - replace with actual Prisma create
    const newCocktailId = Math.floor(Math.random() * 1000);

    res.status(201).json({
      message: 'Cocktail created successfully',
      id: newCocktailId,
    });
  } catch (e) {
    console.error('API Error', e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export default cocktailRouter;
