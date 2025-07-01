import express, { Request, Response } from 'express';
import { apiAuth } from '../../tools/middleware';
import { CocktailCreatePayload } from '../../types/api';

const cocktailRouter = express.Router();

cocktailRouter.get('/', async (req: Request, res: Response) => {
  try {
    const cocktails = await req.db.cocktail.findMany({
      include: {
        ingredients: {
          include: {
            ingredient: true,
            unit: true,
          },
        },
        recipeSteps: {
          orderBy: {
            stepNumber: 'asc',
          },
        },
        flavorProfiles: {
          include: {
            flavorProfile: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return res.status(200).json(cocktails);
  } catch (error) {
    console.error('Error getting cocktails', error);
    return res.status(500).json({
      message: 'Error getting cocktails',
    });
  }
});

cocktailRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const cocktail = await req.db.cocktail.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
            unit: true,
          },
        },
        recipeSteps: {
          orderBy: {
            stepNumber: 'asc',
          },
        },
        flavorProfiles: {
          include: {
            flavorProfile: true,
          },
        },
      },
    });

    if (!cocktail) {
      return res.status(404).json({ message: 'Cocktail not found' });
    }

    return res.json(cocktail);
  } catch (error) {
    console.error('Error getting cocktail', error);
    return res.status(500).json({
      message: 'Error getting cocktail',
    });
  }
});

cocktailRouter.delete('/:id', apiAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if cocktail exists
    const existingCocktail = await req.db.cocktail.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCocktail) {
      return res.status(404).json({
        message: 'Cocktail not found',
      });
    }

    // Delete the cocktail (cascade will handle related records)
    await req.db.cocktail.delete({
      where: { id: parseInt(id) },
    });

    return res.json({
      message: 'Cocktail deleted successfully',
    });
  } catch (error) {
    console.error('API Error', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
});

cocktailRouter.post('/', apiAuth, async (req: Request, res: Response) => {
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
      return res
        .status(400)
        .json({ error: 'Missing required cocktail fields.' });
    }

    // Create the cocktail
    const cocktail = await req.db.cocktail.create({
      data: {
        name: cocktailData.name,
        slug: cocktailData.slug,
        description: cocktailData.description,
        garnish:
          cocktailData.garnishes?.map(g => g.garnishName).join(', ') || null,
        glass: cocktailData.glass,
        category: cocktailData.category,
        difficulty: 'beginner', // Default difficulty
      },
    });

    // Create ingredients (simplified for now - would need ingredient lookup)
    for (const ingredientData of cocktailData.ingredients) {
      // For now, we'll skip ingredient creation since we need to look up ingredient IDs
      // This would require a more complex implementation with ingredient management
      console.log(
        `Would create ingredient: ${ingredientData.ingredientName} - ${ingredientData.quantity} ${ingredientData.unitAbbreviation}`
      );
    }

    // Create recipe steps
    for (const stepData of cocktailData.recipeSteps) {
      await req.db.recipeStep.create({
        data: {
          cocktailId: cocktail.id,
          stepNumber: stepData.stepNumber,
          instruction: stepData.instruction,
        },
      });
    }

    // Create flavor profiles if provided (simplified for now)
    if (cocktailData.flavorProfiles) {
      for (const flavorData of cocktailData.flavorProfiles) {
        // This would require flavor profile lookup
        console.log(
          `Would create flavor profile: ${flavorData.profileName} - intensity ${flavorData.intensity}`
        );
      }
    }

    return res.status(201).json({
      message: 'Cocktail created successfully',
      id: cocktail.id,
    });
  } catch (e) {
    console.error('API Error', e);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export default cocktailRouter;
