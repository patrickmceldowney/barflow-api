import express, { Request, Response } from 'express';

const favoritesRouter = express.Router();

// Get user's favorite cocktails
favoritesRouter.get('/', async (req: Request, res: Response) => {
  try {
    // TODO: Extract user from JWT token middleware
    // const userId = req.user.id;

    // TODO: Get user favorites from Prisma
    // const favorites = await prisma.userFavorite.findMany({
    //   where: { userId },
    //   include: {
    //     cocktail: {
    //       include: {
    //         flavor_profiles: true,
    //         ingredients: true,
    //       }
    //     }
    //   }
    // });

    const mockFavorites = [
      {
        id: 1,
        cocktailId: 1,
        addedAt: '2024-01-15T10:30:00Z',
        cocktail: {
          id: 1,
          name: 'Gin & Tonic',
          description: 'A classic refreshing cocktail',
          difficulty: 'beginner',
          flavorProfiles: ['bitter', 'herbal'],
          ingredients: ['gin', 'tonic water', 'lime'],
        },
      },
      {
        id: 2,
        cocktailId: 2,
        addedAt: '2024-01-10T14:20:00Z',
        cocktail: {
          id: 2,
          name: 'Mojito',
          description: 'A refreshing Cuban highball',
          difficulty: 'beginner',
          flavorProfiles: ['sweet', 'herbal', 'sour'],
          ingredients: ['rum', 'lime', 'mint', 'simple-syrup'],
        },
      },
    ];

    return res.json({
      favorites: mockFavorites,
      totalCount: mockFavorites.length,
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Add cocktail to favorites
favoritesRouter.post('/:cocktailId', async (req: Request, res: Response) => {
  try {
    const { cocktailId } = req.params;

    // TODO: Extract user from JWT token middleware
    // const userId = req.user.id;

    // TODO: Check if cocktail exists
    // const cocktail = await prisma.cocktail.findUnique({
    //   where: { id: parseInt(cocktailId) }
    // });
    // if (!cocktail) {
    //   return res.status(404).json({ error: 'Cocktail not found' });
    // }

    // TODO: Check if already favorited
    // const existingFavorite = await prisma.userFavorite.findFirst({
    //   where: {
    //     userId,
    //     cocktailId: parseInt(cocktailId)
    //   }
    // });
    // if (existingFavorite) {
    //   return res.status(409).json({ error: 'Cocktail already in favorites' });
    // }

    // TODO: Add to favorites with Prisma
    // const favorite = await prisma.userFavorite.create({
    //   data: {
    //     userId,
    //     cocktailId: parseInt(cocktailId),
    //   },
    //   include: {
    //     cocktail: true
    //   }
    // });

    return res.status(201).json({
      message: 'Cocktail added to favorites',
      favorite: {
        id: 3,
        cocktailId: parseInt(cocktailId),
        addedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove cocktail from favorites
favoritesRouter.delete('/:cocktailId', async (req: Request, res: Response) => {
  try {
    const { cocktailId } = req.params;

    // TODO: Extract user from JWT token middleware
    // const userId = req.user.id;

    // TODO: Remove from favorites with Prisma
    // const deletedFavorite = await prisma.userFavorite.deleteMany({
    //   where: {
    //     userId,
    //     cocktailId: parseInt(cocktailId)
    //   }
    // });

    // if (deletedFavorite.count === 0) {
    //   return res.status(404).json({ error: 'Favorite not found' });
    // }

    return res.json({
      message: 'Cocktail removed from favorites',
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Check if cocktail is favorited
favoritesRouter.get(
  '/:cocktailId/check',
  async (req: Request, res: Response) => {
    try {
      const { cocktailId } = req.params;

      // TODO: Extract user from JWT token middleware
      // const userId = req.user.id;

      // TODO: Check if favorited with Prisma
      // const favorite = await prisma.userFavorite.findFirst({
      //   where: {
      //     userId,
      //     cocktailId: parseInt(cocktailId)
      //   }
      // });

      // Mock response
      const isFavorited = Math.random() > 0.5; // Random for demo

      return res.json({
        isFavorited,
        cocktailId: parseInt(cocktailId),
      });
    } catch (error) {
      console.error('Check favorite error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default favoritesRouter;
