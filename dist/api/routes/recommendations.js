"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recommendationsRouter = express_1.default.Router();
recommendationsRouter.post('/cocktails', async (req, res) => {
    try {
        const { favoriteFlavors = [], favoriteIngredients = [], dietaryRestrictions = [], alcoholPreference = 'moderate', skillLevel = 'beginner', limit = 10, } = req.body;
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
        const filteredRecommendations = mockRecommendations.filter(cocktail => {
            if (dietaryRestrictions.includes('no-nuts')) {
                return true;
            }
            return true;
        });
        return res.json({
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
    }
    catch (error) {
        console.error('Recommendations error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
recommendationsRouter.get('/discover', async (req, res) => {
    try {
        const { limit = 5 } = req.query;
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
        return res.json({
            cocktails: mockRandomCocktails,
            totalFound: mockRandomCocktails.length,
        });
    }
    catch (error) {
        console.error('Discover error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
recommendationsRouter.get('/trending', async (req, res) => {
    try {
        const { limit = 10 } = req.query;
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
        return res.json({
            cocktails: mockTrendingCocktails,
            totalFound: mockTrendingCocktails.length,
        });
    }
    catch (error) {
        console.error('Trending error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = recommendationsRouter;
//# sourceMappingURL=recommendations.js.map