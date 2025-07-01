"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const favoritesRouter = express_1.default.Router();
favoritesRouter.get('/', async (req, res) => {
    try {
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
    }
    catch (error) {
        console.error('Get favorites error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
favoritesRouter.post('/:cocktailId', async (req, res) => {
    try {
        const { cocktailId } = req.params;
        return res.status(201).json({
            message: 'Cocktail added to favorites',
            favorite: {
                id: 3,
                cocktailId: parseInt(cocktailId),
                addedAt: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        console.error('Add favorite error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
favoritesRouter.delete('/:cocktailId', async (req, res) => {
    try {
        const { cocktailId } = req.params;
        return res.json({
            message: 'Cocktail removed from favorites',
        });
    }
    catch (error) {
        console.error('Remove favorite error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
favoritesRouter.get('/:cocktailId/check', async (req, res) => {
    try {
        const { cocktailId } = req.params;
        const isFavorited = Math.random() > 0.5;
        return res.json({
            isFavorited,
            cocktailId: parseInt(cocktailId),
        });
    }
    catch (error) {
        console.error('Check favorite error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = favoritesRouter;
//# sourceMappingURL=favorites.js.map