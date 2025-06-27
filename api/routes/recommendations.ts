import express, { Request, Response } from 'express';

const recommendationsRouter = express.Router();

// Get personalized cocktail recommendations
recommendationsRouter.post(
  '/cocktails',
  async (req: Request, res: Response) => {
    try {
      const {
        favoriteFlavors = [],
        favoriteIngredients = [],
        dietaryRestrictions = [],
        alcoholPreference = 'moderate',
        skillLevel = 'beginner',
        limit = 10,
      } = req.body;

      // TODO: Extract user from JWT token middleware (if logged in)
      // const userId = req.user?.id;

      // TODO: Use Prisma to find cocktails that match preferences
      // const recommendations = await prisma.cocktail.findMany({
      //   where: {
      //     AND: [
      //       {
      //         flavor_profiles: {
      //           some: {
      //             name: { in: favoriteFlavors }
      //           }
      //         }
      //       },
      //       {
      //         ingredients: {
      //           some: {
      //             name: { in: favoriteIngredients }
      //           }
      //         }
      //       },
      //       {
      //         difficulty: skillLevel
      //       }
      //     ]
      //   },
      //   include: {
      //     flavor_profiles: true,
      //     ingredients: true,
      //   },
      //   take: limit
      // });

      // Mock recommendations based on preferences
      const mockRecommendations = [
        {
          id: 1,
          name: 'Gin & Tonic',
          description: 'A classic refreshing cocktail',
          difficulty: 'beginner',
          flavorProfiles: ['bitter', 'herbal'],
          ingredients: ['gin', 'tonic water', 'lime'],
          matchScore: 85,
        },
        {
          id: 2,
          name: 'Mojito',
          description: 'A refreshing Cuban highball',
          difficulty: 'beginner',
          flavorProfiles: ['sweet', 'herbal', 'sour'],
          ingredients: ['rum', 'lime', 'mint', 'simple-syrup'],
          matchScore: 92,
        },
        {
          id: 3,
          name: 'Margarita',
          description: 'A classic tequila cocktail',
          difficulty: 'intermediate',
          flavorProfiles: ['sour', 'sweet'],
          ingredients: ['tequila', 'lime', 'triple-sec'],
          matchScore: 78,
        },
      ];

      // Filter based on dietary restrictions
      const filteredRecommendations = mockRecommendations.filter(cocktail => {
        if (dietaryRestrictions.includes('no-nuts')) {
          // TODO: Check if cocktail contains nuts
          return true; // Mock - would check actual ingredients
        }
        return true;
      });

      res.json({
        recommendations: filteredRecommendations,
        totalFound: filteredRecommendations.length,
        preferences: {
          favoriteFlavors,
          favoriteIngredients,
          dietaryRestrictions,
          alcoholPreference,
          skillLevel,
        },
      });
    } catch (error) {
      console.error('Recommendations error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Get cocktail discovery (random cocktails)
recommendationsRouter.get('/discover', async (req: Request, res: Response) => {
  try {
    const { limit = 5 } = req.query;

    // TODO: Get random cocktails from Prisma
    // const randomCocktails = await prisma.cocktail.findMany({
    //   take: parseInt(limit as string),
    //   orderBy: {
    //     _count: {
    //       select: { id: true }
    //     }
    //   }
    // });

    const mockRandomCocktails = [
      {
        id: 4,
        name: 'Old Fashioned',
        description: 'A classic whiskey cocktail',
        difficulty: 'intermediate',
        flavorProfiles: ['bitter', 'sweet'],
        ingredients: ['whiskey', 'bitters', 'simple-syrup'],
      },
      {
        id: 5,
        name: 'Negroni',
        description: 'An Italian aperitif',
        difficulty: 'beginner',
        flavorProfiles: ['bitter', 'herbal'],
        ingredients: ['gin', 'campari', 'vermouth'],
      },
    ];

    res.json({
      cocktails: mockRandomCocktails,
      totalFound: mockRandomCocktails.length,
    });
  } catch (error) {
    console.error('Discover error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get trending cocktails
recommendationsRouter.get('/trending', async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    // TODO: Get trending cocktails based on views/favorites from Prisma
    // const trendingCocktails = await prisma.cocktail.findMany({
    //   take: parseInt(limit as string),
    //   orderBy: {
    //     viewCount: 'desc'
    //   }
    // });

    const mockTrendingCocktails = [
      {
        id: 1,
        name: 'Gin & Tonic',
        description: 'A classic refreshing cocktail',
        viewCount: 1250,
        favoriteCount: 89,
      },
      {
        id: 2,
        name: 'Mojito',
        description: 'A refreshing Cuban highball',
        viewCount: 1100,
        favoriteCount: 76,
      },
    ];

    res.json({
      cocktails: mockTrendingCocktails,
      totalFound: mockTrendingCocktails.length,
    });
  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default recommendationsRouter;
