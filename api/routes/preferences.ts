import express, { Request, Response } from 'express';

const preferencesRouter = express.Router();

// Get user preferences
preferencesRouter.get('/', async (req: Request, res: Response) => {
  try {
    // TODO: Extract user from JWT token middleware
    // const userId = req.user.id;

    // TODO: Get user preferences from Prisma
    // const preferences = await prisma.userPreferences.findUnique({
    //   where: { userId }
    // });

    // Mock data
    const preferences = {
      favoriteFlavors: ['sweet', 'fruity', 'herbal'],
      favoriteIngredients: ['gin', 'lime', 'mint'],
      dietaryRestrictions: ['no-nuts'],
      alcoholPreference: 'moderate',
      skillLevel: 'beginner',
      preferredGlassware: ['coupe', 'rocks'],
    };

    return res.json(preferences);
  } catch (error) {
    console.error('Get preferences error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user preferences
preferencesRouter.put('/', async (req: Request, res: Response) => {
  try {
    const {
      favoriteFlavors,
      favoriteIngredients,
      dietaryRestrictions,
      alcoholPreference,
      skillLevel,
      preferredGlassware,
    } = req.body;

    // TODO: Extract user from JWT token middleware
    // const userId = req.user.id;

    // TODO: Update user preferences with Prisma
    // const preferences = await prisma.userPreferences.upsert({
    //   where: { userId },
    //   update: {
    //     favoriteFlavors,
    //     favoriteIngredients,
    //     dietaryRestrictions,
    //     alcoholPreference,
    //     skillLevel,
    //     preferredGlassware,
    //   },
    //   create: {
    //     userId,
    //     favoriteFlavors,
    //     favoriteIngredients,
    //     dietaryRestrictions,
    //     alcoholPreference,
    //     skillLevel,
    //     preferredGlassware,
    //   },
    // });

    return res.json({
      message: 'Preferences updated successfully',
      preferences: {
        favoriteFlavors,
        favoriteIngredients,
        dietaryRestrictions,
        alcoholPreference,
        skillLevel,
        preferredGlassware,
      },
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get questionnaire questions
preferencesRouter.get('/questionnaire', async (req: Request, res: Response) => {
  try {
    const questions = [
      {
        id: 'flavor-profiles',
        type: 'multi-select',
        question: 'What flavor profiles do you enjoy?',
        options: [
          { value: 'sweet', label: 'Sweet' },
          { value: 'sour', label: 'Sour' },
          { value: 'bitter', label: 'Bitter' },
          { value: 'herbal', label: 'Herbal' },
          { value: 'spicy', label: 'Spicy' },
          { value: 'fruity', label: 'Fruity' },
          { value: 'smoky', label: 'Smoky' },
          { value: 'floral', label: 'Floral' },
          { value: 'creamy', label: 'Creamy' },
          { value: 'nutty', label: 'Nutty' },
        ],
      },
      {
        id: 'ingredients',
        type: 'multi-select',
        question: 'What ingredients do you like?',
        options: [
          { value: 'gin', label: 'Gin' },
          { value: 'vodka', label: 'Vodka' },
          { value: 'rum', label: 'Rum' },
          { value: 'tequila', label: 'Tequila' },
          { value: 'whiskey', label: 'Whiskey' },
          { value: 'lime', label: 'Lime' },
          { value: 'lemon', label: 'Lemon' },
          { value: 'mint', label: 'Mint' },
          { value: 'simple-syrup', label: 'Simple Syrup' },
          { value: 'bitters', label: 'Bitters' },
        ],
      },
      {
        id: 'alcohol-preference',
        type: 'single-select',
        question: 'What is your alcohol preference?',
        options: [
          { value: 'none', label: 'No alcohol' },
          { value: 'light', label: 'Light' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'strong', label: 'Strong' },
        ],
      },
      {
        id: 'skill-level',
        type: 'single-select',
        question: 'What is your cocktail making skill level?',
        options: [
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' },
        ],
      },
    ];

    return res.json(questions);
  } catch (error) {
    console.error('Get questionnaire error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default preferencesRouter;
